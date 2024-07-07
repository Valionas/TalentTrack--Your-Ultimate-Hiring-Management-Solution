// src/components/JobCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Box,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import { Job } from "../../packages/models/Job";

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={job.companyLogo}
          alt={job.companyName}
          sx={{ width: 56, height: 56, mr: 2 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{job.title}</Typography>
          <Typography variant="subtitle2">{job.companyName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {job.location} | {job.type}
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {job.skills.map((skill, index) => (
              <Grid item key={index}>
                <Chip label={skill} variant="outlined" />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="body2" color="textSecondary">
            {job.datePosted}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

interface JobCardProps {
  job: Job;
}

export default JobCard;
