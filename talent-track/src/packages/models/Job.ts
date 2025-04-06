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
  benefits: string[];
  applicationDeadline: string;
  jobId: string;
  createdBy: string;
  applicants?: string[];
}

export interface JobResponse extends Job {
  _id: string;
}
