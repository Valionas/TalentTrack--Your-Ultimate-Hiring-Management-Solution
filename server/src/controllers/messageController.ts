import { Request, Response } from 'express';
import MessageModel, { Message } from '../models/Message';

// Get all messages
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await MessageModel.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve messages', error });
  }
};

// Get message details by ID
export const getMessageDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await MessageModel.findById(req.params.id);
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve message details', error });
  }
};

// Get messages by receiver (only retrieve messages sent to a specific user)
export const getMessagesByReceiver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { receiver } = req.params;
    const messages = await MessageModel.find({ receiver });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve messages for receiver', error });
  }
};

// Create a new message
export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = new MessageModel(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create message', error });
  }
};

// Update a message by ID
export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await MessageModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update message', error });
  }
};

// Delete a message by ID
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await MessageModel.findByIdAndDelete(req.params.id);
    if (message) {
      res.status(200).json({ message: 'Message deleted successfully' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message', error });
  }
};
