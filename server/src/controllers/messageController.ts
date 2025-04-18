// src/controllers/messageController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import MessageModel from '../models/Message';
import UserModel   from '../models/User';
import { resolveUser } from '../utils/resolveUser';

/* ------------ helpers ------------ */
const emailToId = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error(`User ${email} not found`);
  return user._id;
};

const resolveReceiver = async (receiver: string) => {
  // accept either 24‑char hex ID or e‑mail
  if (mongoose.Types.ObjectId.isValid(receiver)) return receiver;
  return emailToId(receiver);
};

/* -------- get all messages -------- */
export const getMessages = async (_: Request, res: Response) => {
  try {
    const msgs = await MessageModel.find();
    res.status(200).json(msgs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve messages', err });
  }
};

/* -------- get one by ID ----------- */
export const getMessageDetails = async (req: Request, res: Response) => {
  try {
    const msg = await MessageModel.findById(req.params.id);
    msg
      ? res.status(200).json(msg)
      : res.status(404).json({ message: 'Message not found' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve message details', err });
  }
};

/* ----- inbox by receiver (id or email) ----- */
export const getMessagesByReceiver = async (req: Request, res: Response) => {
  try {
    const receiverId = await resolveReceiver(req.params.receiver);

    // exclude messages the user already deleted
    const msgs = await MessageModel.find({
      receiverId,
      deletedFor: { $ne: receiverId },
    }).sort({ createdAt: -1 });

    res.status(200).json(msgs);
  } catch (err) {
    res
      .status(400)
      .json({
        message: 'Failed to retrieve messages for receiver',
        err: (err as Error).message,
      });
  }
};

/* ------------- create ------------- */
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { sender, receiver, topic, description } = req.body;

    const senderId   = await resolveUser(sender);
    const receiverId = await resolveUser(receiver);

    const senderUser   = await UserModel.findById(senderId).select('email');
    const receiverUser = await UserModel.findById(receiverId).select('email');

    const msg = await MessageModel.create({
      date: new Date().toISOString(),
      senderId,
      receiverId,
      senderEmail:   senderUser?.email,
      receiverEmail: receiverUser?.email,
      topic,
      description,
    });

    res.status(201).json(msg);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to create message', err: (err as Error).message });
  }
};

/* ------------- update ------------- */
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const allowed = { topic: 1, description: 1 }; // only these can change
    const data: any = {};
    Object.keys(req.body).forEach((k) => {
      if (allowed[k as keyof typeof allowed]) data[k] = req.body[k];
    });

    const msg = await MessageModel.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    msg
      ? res.status(200).json(msg)
      : res.status(404).json({ message: 'Message not found' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update message', err });
  }
};

/* ------------- delete (soft) ------------- */
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    // assume auth middleware sets req.user.id
    const userId = (req as any).user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // add userId to deletedFor array
    const msg = await MessageModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { deletedFor: userId } },
      { new: true }
    );

    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // OPTIONAL purge: if both participants deleted, remove for good
    if (
      msg.deletedFor.includes(msg.senderId) &&
      msg.deletedFor.includes(msg.receiverId)
    ) {
      await msg.deleteOne();
    }

    res.status(200).json({ message: 'Message deleted for current user' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message', err });
  }
};
