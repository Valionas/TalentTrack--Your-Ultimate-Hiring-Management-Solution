// packages/models/UserProfile.ts

export interface Rating {
    raterId: string;
    grade: number;
}

export interface WorkExperience {
    name: string;
    from: string;
    to: string;
    description: string;
    company: string;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    age?: number;
    country?: string;
    industry: string;
    language?: string;
    phone?: string;
    address?: string;
    skills?: string[];
    ratings?: Rating[];
    workExperience?: WorkExperience[] | null;
}

export interface UserProfileResponse extends UserProfile {
    _id: string;
}

