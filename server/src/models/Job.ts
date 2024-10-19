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
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  datePosted: { type: String, required: true },
  skills: { type: [String], required: true },
  description: { type: String, required: true },
  salaryRange: { type: String },
  experience: { type: String, required: true },
  contactEmail: { type: String, required: true },
  category: { type: String, required: true },
  benefits: { type: [String], required: true },
  applicationDeadline: { type: String, required: true },
  jobId: { type: String, required: true },
});

const JobModel = mongoose.model<Job>('Job', JobSchema);

export default JobModel;
