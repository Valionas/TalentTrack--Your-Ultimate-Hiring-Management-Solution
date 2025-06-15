// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface Rating {
  raterId: string;
  grade: number;
}

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
  safeCode: string;       
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
  ratings: Rating[];    
}

const RatingSchema = new Schema<Rating>({
  raterId: { type: String, required: true },
  grade:   { type: Number, required: true, min: 0, max: 5 },
}, { _id: false });


const WorkExperienceSchema: Schema = new Schema({
  name:        { type: String, required: true },
  from:        { type: String, required: true },
  to:          { type: String },
  description: { type: String },
  company:     { type: String, required: true },
});

const UserSchema: Schema = new Schema({
  email:           { type: String, required: true, unique: true },
  password:        { type: String, required: true },
  safeCode:        { type: String, required: true },
  firstName:       { type: String },
  lastName:        { type: String },
  age:             { type: Number },
  industry:        { type: String },
  country:         { type: String },
  language:        { type: String },
  phone:           { type: String },
  address:         { type: String },
  skills:          { type: [String], default: [] },
  avatar:          { type: String },
  workExperience:  { type: [WorkExperienceSchema], default: [] },
  ratings:        { type: [RatingSchema], default: [] },  
});


const User = mongoose.model<IUser>('User', UserSchema);

export default User;
