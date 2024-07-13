// src/components/Jobs.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Chip,
  SelectChangeEvent,
  Autocomplete,
  AutocompleteRenderInputParams,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import JobCard from './JobCard';
import { jobs as mockJobs } from './jobsMockData';

import 'react-toastify/dist/ReactToastify.css';
import { Benefit } from '../../packages/models/Job';

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date');
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [additionalSkills, setAdditionalSkills] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<Benefit[]>([]);

  const theme = useTheme();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterJobs(term, selectedSkills, additionalSkills, selectedBenefits);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const order = event.target.value;
    setSortOrder(order);
    sortJobs(filteredJobs, order);
  };

  const handleAdditionalSkillsChange = (event: any, values: string[]) => {
    setAdditionalSkills(values);
    filterJobs(searchTerm, selectedSkills, values, selectedBenefits);
  };

  const handleBenefitsChange = (event: any, values: Benefit[]) => {
    setSelectedBenefits(values);
    filterJobs(searchTerm, selectedSkills, additionalSkills, values);
  };

  const filterJobs = (
    term: string,
    skills: string[],
    additionalSkills: string[],
    benefits: Benefit[],
  ) => {
    let jobs = mockJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.companyName.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term),
    );

    const allSkills = [...skills, ...additionalSkills];

    if (allSkills.length > 0) {
      jobs = jobs.filter((job) =>
        allSkills.every((skill) => job.skills.includes(skill)),
      );
    }

    if (benefits.length > 0) {
      jobs = jobs.filter((job) =>
        benefits.every((benefit) => job.benefits.includes(benefit)),
      );
    }

    sortJobs(jobs, sortOrder);
  };

  const sortJobs = (jobs: typeof mockJobs, order: string) => {
    let sortedJobs = [...jobs];
    if (order === 'date') {
      sortedJobs = sortedJobs.sort(
        (a, b) =>
          new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
      );
    } else if (order === 'asc') {
      sortedJobs = sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sortedJobs = sortedJobs.sort((a, b) => b.title.localeCompare(a.title));
    }
    setFilteredJobs(sortedJobs);
  };

  const uniqueSkills = Array.from(
    new Set(mockJobs.flatMap((job) => job.skills)),
  );

  const benefitOptions = Object.values(Benefit);

  return (
    <Box sx={{ py: 2, px: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            multiple
            options={uniqueSkills}
            value={additionalSkills}
            onChange={handleAdditionalSkillsChange}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  label={option}
                  icon={
                    <CheckIcon style={{ color: theme.palette.primary.main }} />
                  }
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField
                {...params}
                variant="outlined"
                label="Additional Skills"
                placeholder="Add skills"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            multiple
            options={benefitOptions}
            value={selectedBenefits}
            onChange={handleBenefitsChange}
            renderTags={(value: Benefit[], getTagProps) =>
              value.map((option: Benefit, index: number) => (
                <Chip
                  label={option}
                  icon={
                    <CheckIcon style={{ color: theme.palette.primary.main }} />
                  }
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField
                {...params}
                variant="outlined"
                label="Benefits"
                placeholder="Add benefits"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="date">Date Posted</MenuItem>
              <MenuItem value="asc">Title Ascending</MenuItem>
              <MenuItem value="desc">Title Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        {filteredJobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </Box>
    </Box>
  );
};

export default Jobs;
