import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
  date: string;
  sender: string;
  receiver: string;
  description: string;
}

const MessageSchema: Schema = new Schema({
  date: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  description: { type: String, required: true }
});

const MessageModel = mongoose.model<Message>('Message', MessageSchema);

export default MessageModel;
