// src/packages/models/jobsMockData.ts

import { Benefit, Job } from "../../packages/models/Job";


export const jobs: Job[] = [
  {
    title: 'Senior Front-End Developer',
    companyName: 'Yotpo',
    companyLogo: 'path/to/logo1.png',
    location: 'Sofia | Hybrid',
    type: 'Full-Time',
    datePosted: '5 days ago',
    skills: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'CSS'],
    description: 'We are looking for a Senior Front-End Developer to join our team...',
    salaryRange: '$100,000 - $120,000',
    experience: '5+ years',
    contactEmail: 'hr@yotpo.com',
    category: 'Engineering',
    benefits: [Benefit.HealthInsurance, Benefit.RetirementPlan, Benefit.RemoteWork],
    applicationDeadline: '2023-07-31',
    jobId: 'J12345',
  },
  {
    title: 'Software Engineering Manager Frontend',
    companyName: 'PayRetailers',
    companyLogo: 'path/to/logo2.png',
    location: 'Sofia | Hybrid',
    type: 'Full-Time',
    datePosted: '5 days ago',
    skills: ['React', 'TypeScript'],
    description: 'Lead a team of front-end developers to build cutting-edge applications...',
    experience: '8+ years',
    contactEmail: 'careers@payretailers.com',
    category: 'Engineering',
    benefits: [Benefit.HealthInsurance, Benefit.StockOptions],
    applicationDeadline: '2023-08-15',
    jobId: 'J12346',
  },
  // Add more job entries as needed...
];
