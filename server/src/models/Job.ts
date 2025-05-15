import mongoose, { Schema, Document } from 'mongoose';

export interface Job extends Document {
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  type: string;
  datePosted: string;
  skills: string[];
  description: string;
  salaryRange?: string;
  experience: string;
  contactEmail: string;
  category: string;
  benefits: string[];
  applicationDeadline: string;
  jobId: string;
  createdBy: string; // Added property to track the owner's email
}

const JobSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  companyLogo: {
    type: String, // data URL or URL
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract'],
    required: [true, 'Job type is required'],
  },
  datePosted: {
    type: Date,
    required: [true, 'Date posted is required'],
    default: Date.now,
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: [(arr: string | any[]) => arr.length > 0, 'At least one skill is required'],
  },
  benefits: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  salaryRange: {
    type: String,
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  jobId: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const JobModel = mongoose.model<Job>('Job', JobSchema);

export default JobModel;
