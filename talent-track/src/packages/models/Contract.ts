// packages/models/Contract.ts

export type ContractStatus = 'Applied' | 'Rejected' | 'Approved';

export interface Contract {
    // The ID for the contract document (MongoDB _id)
    _id?: string;

    // References the job's _id
    jobId: string;

    // For UI convenience, store the job name directly
    jobName: string;

    // Contact email from the job or user
    contactEmail: string;

    // References the user's _id
    userId: string;

    // The contract status
    status: ContractStatus;

    // Possibly track creation and update times
    createdAt?: string;
    updatedAt?: string;
    applicantsCount?: number;

    // Add any other fields your backend may return
}
