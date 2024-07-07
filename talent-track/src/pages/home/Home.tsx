// src/pages/home/Home.tsx
import React from "react";
import { Container } from "@mui/material";
import BackgroundComponent from "./Background";
import InitialSection from "./initial-section/InitialSection";
import FeatureSection from "./feature-section/FeatureSection";
import ReviewsSection from "./review-section/ReviewSection";
import AboutUsSection from "./about-us-section/AboutUsSection";

const Home: React.FC = () => {
  return (
    <BackgroundComponent>
      <Container maxWidth="lg">
        <InitialSection />
        <FeatureSection />
        <AboutUsSection />
        <ReviewsSection />
      </Container>
    </BackgroundComponent>
  );
};

export default Home;
