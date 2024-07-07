// src/components/ReviewsSection.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import ReviewCard from "./ReviewCard";

const reviews = [
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
    text: "TalentTrack helped me find the perfect job! The platform is easy to use and the support team is fantastic.",
  },
  {
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 4,
    text: "Great experience! I found several opportunities and landed my dream job in no time.",
  },
  {
    name: "Emily Johnson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 5,
    text: "The best job platform I have ever used. Highly recommend TalentTrack to everyone looking for a new job.",
  },
  {
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 4,
    text: "A very user-friendly platform with excellent features. I was able to find multiple job offers quickly.",
  },
];

const ReviewsSection: React.FC = () => {
  return (
    <Box sx={{ background: "#1e3c72", color: "white", padding: "2rem 0" }}>
      <Typography variant="h4" align="center" gutterBottom>
        What Our Users Say
      </Typography>
      {reviews.map((review, index) => (
        <ReviewCard
          key={index}
          direction={index % 2 === 0 ? "left" : "right"}
          review={review}
        />
      ))}
    </Box>
  );
};

export default ReviewsSection;
