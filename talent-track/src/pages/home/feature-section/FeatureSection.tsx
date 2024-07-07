// src/components/FeatureSection.tsx
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Feature from "./Feature";
import { FaRocket, FaUsers, FaBriefcase } from "react-icons/fa";

const DiagonalBox = styled(Box)({
  position: "relative",
  transform: "skewY(-10deg)",
  overflow: "hidden",
  padding: "6rem 0",
  background: "#1e3c72", // Dark background to contrast white text
});

const Content = styled(Box)({
  transform: "skewY(10deg)",
  padding: "3rem 1rem",
  textAlign: "center",
  color: "white", // Ensure text is white
});

const features = [
  {
    icon: <FaRocket size={60} />,
    title: "Fast and Efficient",
    description: "Our platform ensures quick and easy job applications.",
  },
  {
    icon: <FaUsers size={60} />,
    title: "Community Focused",
    description: "Join a vibrant community of professionals and employers.",
  },
  {
    icon: <FaBriefcase size={60} />,
    title: "Career Growth",
    description:
      "Find opportunities that help you grow and advance your career.",
  },
];

const FeatureSection: React.FC = () => {
  return (
    <DiagonalBox>
      <Content>
        <Grid container spacing={5}>
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </Grid>
      </Content>
    </DiagonalBox>
  );
};

export default FeatureSection;
