import mongoose, { Document, Schema } from 'mongoose';

// Define the WorkExperience interface
export interface WorkExperience {
  name: string;
  from: string;
  to: string;
  description: string;
  company: string;
}

// Define the IUser interface
export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
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

// Define the main User schema
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
  industry: { type: String },
  country: { type: String },
  language: { type: String },
  phone: { type: String },
  address: { type: String },
  skills: { type: [String] },  // Array of skills
  avatar: { type: String, required: false },    // Avatar image URL
  workExperience: { type: [WorkExperienceSchema], required: false }, // Reference the WorkExperienceSchema
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
