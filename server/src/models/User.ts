import mongoose, { Document, Schema } from 'mongoose';

export interface WorkExperience {
  name: string;
  from: string;
  to: string;
  description: string;
  company: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  safeCode?: string; // New field for the hashed safe code
  firstName?: string;
  lastName?: string;
  age?: number;
  industry?: string;
  country?: string;
  language?: string;
  phone?: string;
  address?: string;
  skills?: string[];
  avatar?: string;
  workExperience?: WorkExperience[];
}

const WorkExperienceSchema: Schema = new Schema({
  name: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String },
  description: { type: String },
  company: { type: String, required: true },
});

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  safeCode: { type: String, required: true }, // Store the hashed safe code
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  industry: { type: String },
  country: { type: String },
  language: { type: String },
  phone: { type: String },
  address: { type: String },
  skills: { type: [String] },
  avatar: { type: String },
  workExperience: { type: [WorkExperienceSchema] },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
