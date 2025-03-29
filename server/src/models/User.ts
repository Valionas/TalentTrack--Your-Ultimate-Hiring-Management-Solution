// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the WorkExperience interface
export interface WorkExperience {
  name: string;
  from: string;
  to: string;
  description: string;
  company: string;
}

// Update the IUser interface to include firstName and lastName
export interface IUser extends Document {
  email: string;
  password: string;
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

// Define a separate schema for workExperience
const WorkExperienceSchema: Schema = new Schema({
  name: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String },
  description: { type: String },
  company: { type: String, required: true },
});

// Define the main User schema with firstName and lastName fields
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String }, // New field for first name
  lastName: { type: String },  // New field for last name
  age: { type: Number },
  industry: { type: String },
  country: { type: String },
  language: { type: String },
  phone: { type: String },
  address: { type: String },
  skills: { type: [String] },
  avatar: { type: String, required: false },
  workExperience: { type: [WorkExperienceSchema], required: false },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
