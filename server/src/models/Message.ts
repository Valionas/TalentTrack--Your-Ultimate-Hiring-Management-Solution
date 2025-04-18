// src/models/Message.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Message extends Document {
  date:        string;
  senderId:    Types.ObjectId;
  receiverId:  Types.ObjectId;
  topic:       string;
  description: string;
  senderEmail?:   string;
  receiverEmail?: string;

  /** array of userIds that have deleted (hidden) this message */
  deletedFor: Types.ObjectId[];
}

const MessageSchema = new Schema<Message>(
  {
    date:        { type: String, required: true },
    senderId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    topic:       { type: String, required: true },
    description: { type: String, required: true },

    senderEmail:   String,
    receiverEmail: String,

    deletedFor: [
      { type: Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<Message>('Message', MessageSchema);
