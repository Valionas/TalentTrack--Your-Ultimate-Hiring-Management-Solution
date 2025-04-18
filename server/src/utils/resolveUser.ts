/* utils/resolveUser.ts */
import mongoose from 'mongoose';
import UserModel from '../models/User';

export const resolveUser = async (value: string) => {
  // if 24‑char hex -> treat as ObjectId
  if (mongoose.Types.ObjectId.isValid(value)) return value;

  const user = await UserModel.findOne({ email: value });
  if (!user) throw new Error(`User ${value} not found`);
  return user._id;
};
