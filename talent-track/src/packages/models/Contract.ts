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

    // Array of user‐IDs for whom this contract has been “soft‐deleted”
    deletedFor?: string[];

    // Possibly track creation and update times
    createdAt?: string;
    updatedAt?: string;

    // Optional extra metadata
    applicantsCount?: number;
}
