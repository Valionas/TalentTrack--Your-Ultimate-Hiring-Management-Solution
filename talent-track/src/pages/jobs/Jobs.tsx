import React from "react";
import { Container, Box } from "@mui/material";

import { jobs } from "./jobsMockData";
import JobCard from "./JobCard";

const Jobs: React.FC = () => {
  return (
    <Container>
      <Box sx={{ py: 4 }}>
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </Box>
    </Container>
  );
};

export default Jobs;
