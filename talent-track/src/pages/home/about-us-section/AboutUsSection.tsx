// src/pages/home/about-us-section/AboutUsSection.tsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Container,
} from "@mui/material";
import { team } from "./aboutUsData";
import { motion, useInView } from "framer-motion";
const AnimationBox = motion(Box);
const AboutUsSection: React.FC = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <AnimationBox
      ref={ref}
      initial={{ opacity: 0, x: 100 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 2 }}
      sx={{ py: 8, backgroundColor: "#1e3c72", color: "#fff" }}
    >
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          About Us
        </Typography>
        <Typography variant="h6" align="center" paragraph>
          Our mission is to provide exceptional services to our customers,
          ensuring their utmost satisfaction.
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Our team is composed of dedicated professionals who are passionate
          about their work. Each member brings a unique set of skills and
          expertise to the table, allowing us to tackle a wide range of
          challenges and deliver top-notch solutions. We believe in fostering a
          collaborative and inclusive work environment where everyone's ideas
          are valued and innovation thrives.
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Below you can learn more about our exceptional team members and the
          roles they play in driving our company's success.
        </Typography>
        {team.map((dept, deptIndex) => (
          <Box key={deptIndex} sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ color: "#ffca28" }}
            >
              {dept.department}
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {dept.members.map((member, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      textAlign: "center",
                      height: "100%",
                      backgroundColor: "#f0f0f0",
                      padding: 2,
                    }}
                  >
                    <CardContent>
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        sx={{ width: 80, height: 80, margin: "auto" }}
                      />
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {member.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        "{member.quote}"
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        {member.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </AnimationBox>
  );
};

export default AboutUsSection;
