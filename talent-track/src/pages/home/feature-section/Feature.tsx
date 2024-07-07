// src/components/Feature.tsx
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

const AnimationBox = motion(Box);

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <Grid item xs={12} md={4}>
      <AnimationBox
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {icon}
        </div>
        <Typography variant="h5" gutterBottom style={{ color: "white" }}>
          {title}
        </Typography>
        <Typography variant="body1" style={{ color: "white" }}>
          {description}
        </Typography>
      </AnimationBox>
    </Grid>
  );
};

export default Feature;
