export interface Employee {
    id: number;
    name: string;
    industry: string;
    avatar: string;
    age: number;
    country: string;
    rating: number;
    skills: string[];
    workExperience: WorkExperience[] | null
}
  

export interface WorkExperience {
    name: string;
    from: string;
    to: string;
    description: string;
    company: string;
}