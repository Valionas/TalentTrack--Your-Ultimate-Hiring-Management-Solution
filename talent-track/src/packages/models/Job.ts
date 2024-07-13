// src/packages/models/Job.ts
export enum Benefit {
    HealthInsurance = 'Health Insurance',
    RemoteWork = 'Remote Work',
    GymMembership = 'Gym Membership',
    StockOptions = 'Stock Options',
    FlexibleHours = 'Flexible Hours',
    RetirementPlan = 'Retirement Plan',
  }
  
  export interface Job {
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
    benefits: Benefit[];
    applicationDeadline: string;
    jobId: string;
  }
  