import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";
import hirePhoto from "../../../resources/images/hire-photo.png";
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from "../../../utils/authUtils";

const AnimationBox = motion(Box);

const InitialSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={5} alignItems="center">
      <Grid item xs={12} md={6}>
        <AnimationBox
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome to TalentTrack
          </Typography>
          <Typography variant="h6" paragraph>
            Connecting talent with opportunity seamlessly. Discover jobs, apply
            online, and build your career with ease.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (isLoggedIn()) {
                navigate('/jobs');
              } else {
                navigate('/login');
              }
            }}
            size="large"
          >
            Get Started
          </Button>
        </AnimationBox>
      </Grid>
      <Grid item xs={12} md={6}>
        <AnimationBox
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={hirePhoto} // Use the imported image here
            alt="TalentTrack"
            style={{ width: "100%", borderRadius: "15px" }}
          />
        </AnimationBox>
      </Grid>
    </Grid>
  );
};

export default InitialSection;
