// models/Contract.ts
import { Schema, model, Document } from 'mongoose';

export interface Contract extends Document {
  jobId: string;
  jobName: string;
  contactEmail: string;
  userId: string;
  status: 'Applied' | 'Rejected' | 'Approved';
  deletedFor: string[];     // ← new field
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<Contract>(
  {
    jobId: { type: String, required: true },
    jobName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, enum: ['Applied','Rejected','Approved'], default: 'Applied' },
    deletedFor: { type: [String], default: [] },   // ← initialize empty array
  },
  { timestamps: true }
);

export default model<Contract>('Contract', ContractSchema);
