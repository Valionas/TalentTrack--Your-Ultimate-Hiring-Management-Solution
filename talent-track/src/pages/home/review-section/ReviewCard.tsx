// src/components/ReviewCard.tsx
import React from "react";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import Rating from "@mui/material/Rating";

interface ReviewCardProps {
  direction: "left" | "right";
  review: {
    name: string;
    avatar: string;
    rating: number;
    text: string;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ direction, review }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "2rem 0",
      }}
    >
      <Card
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: direction === "left" ? "row" : "row-reverse",
          maxWidth: 800,
          width: "100%",
        }}
      >
        <Avatar
          src={review.avatar}
          alt={review.name}
          sx={{ width: 100, height: 100, margin: 2 }}
        />
        <CardContent>
          <Typography variant="h6">{review.name}</Typography>
          <Rating value={review.rating} readOnly />
          <Typography variant="body1">{review.text}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReviewCard;
