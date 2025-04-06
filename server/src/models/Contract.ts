// models/Contract.ts
import mongoose, { Schema, Document } from 'mongoose';

export type ContractStatus = 'Applied' | 'Rejected' | 'Approved';

export interface Contract extends Document {
  jobId: string;        // Reference to a Job (job._id)
  jobName: string;      // Store the job's name for convenience
  contactEmail: string; // Store the job's contactEmail for convenience
  userId: string;       // Reference to the User (user._id)
  status: ContractStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const ContractSchema: Schema = new Schema(
  {
    jobId: { type: String, required: true },
    jobName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    userId: { type: String, required: true },
    status: {
      type: String,
      enum: ['Applied', 'Rejected', 'Approved'],
      default: 'Applied',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Create the Mongoose model
const ContractModel = mongoose.model<Contract>('Contract', ContractSchema);

export default ContractModel;
