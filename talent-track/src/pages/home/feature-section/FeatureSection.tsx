// src/components/FeatureSection.tsx
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Feature from "./Feature";
import { features } from "./featureData";

const DiagonalBox = styled(Box)({
  position: "relative",
  overflow: "hidden",
  padding: "6rem 0",
  background: "#1e3c72", // Dark background to contrast white text
});

const Content = styled(Box)({
  padding: "3rem 1rem",
  textAlign: "center",
  color: "white", // Ensure text is white
});

const FeatureSection: React.FC = () => {
  return (
    <DiagonalBox>
      <Content>
        <Typography variant="h4" gutterBottom>
          Our Features
        </Typography>
        <Grid container spacing={15}>
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </Grid>
      </Content>
    </DiagonalBox>
  );
};

export default FeatureSection;
