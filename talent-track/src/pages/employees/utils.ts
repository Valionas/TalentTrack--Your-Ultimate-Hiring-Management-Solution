// src/utils/ratingUtils.ts

export interface Rating {
    raterId: string;
    grade: number;
}

export const calculateAverageRating = (ratings: Rating[] | undefined): number => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, { grade }) => acc + grade, 0);
    const avg = sum / ratings.length;
    return Math.round(avg * 10) / 10;
};
