import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Button,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { MdOutlineLibraryAdd } from 'react-icons/md';
import JobCard from './JobCard';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateJobMutation, useJobsQuery, useDeleteJobMutation, useUpdateJobMutation } from '../../api/services/jobService';
import { isLoggedIn } from '../../utils/authUtils';

import CreateUpdateJob from './CreateUpdateJob';
import { JobResponse, Job } from '../../packages/models/Job';

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date');
  const [filteredJobs, setFilteredJobs] = useState<JobResponse[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [additionalSkills, setAdditionalSkills] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  // State for currently selected job (for update mode)
  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);

  const theme = useTheme();
  const { data: jobs, isLoading, refetch: loadJobs } = useJobsQuery();

  const { mutate: createJobMutation } = useCreateJobMutation({
    onSuccess: () => {
      loadJobs();
    },
    onError: (error: any) => {
      console.error('Error creating job', error);
    },
  });

  const { mutate: deleteJobMutation } = useDeleteJobMutation({
    onSuccess: () => {
      loadJobs();
    },
    onError: (error: any) => {
      console.error('Error deleting job', error);
    },
  });

  const { mutate: updateJobMutation } = useUpdateJobMutation({
    onSuccess: (updatedJob) => {
      console.log('Job updated successfully:', updatedJob);
      loadJobs();
    },
    onError: (error) => {
      console.error('Error updating job:', error);
    },
  });

  useEffect(() => {
    if (jobs) {
      filterJobs(
        searchTerm,
        selectedSkills,
        additionalSkills,
        selectedBenefits,
      );
    }
  }, [jobs, searchTerm, selectedSkills, additionalSkills, selectedBenefits]);

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

  const handleAdditionalSkillsChange = (
    event: React.SyntheticEvent,
    values: string[],
  ) => {
    setAdditionalSkills(values);
    filterJobs(searchTerm, selectedSkills, values, selectedBenefits);
  };

  const handleBenefitsChange = (
    event: React.SyntheticEvent,
    values: string[],
  ) => {
    setSelectedBenefits(values);
    filterJobs(searchTerm, selectedSkills, additionalSkills, values);
  };

  const filterJobs = (
    term: string,
    skills: string[],
    additionalSkills: string[],
    benefits: string[],
  ) => {
    if (!jobs) return;

    let filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.companyName.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term),
    );

    const allSkills = [...skills, ...additionalSkills];

    if (allSkills.length > 0) {
      filtered = filtered.filter((job) =>
        allSkills.every((skill) => job.skills.includes(skill)),
      );
    }

    if (benefits.length > 0) {
      filtered = filtered.filter((job) =>
        benefits.every((benefit) => job.benefits.includes(benefit)),
      );
    }

    sortJobs(filtered, sortOrder);
  };

  const sortJobs = (jobs: JobResponse[], order: string) => {
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
    new Set(jobs?.flatMap((job) => job.skills) || []),
  );

  const benefitOptions = Array.from(
    new Set(jobs?.flatMap((job) => job.benefits) || []),
  );

  const handleOpenDialogForCreate = () => {
    setSelectedJob(null); // Clear selected job for new job creation
    setOpenDialog(true);
  };

  const handleOpenDialogForUpdate = (job: JobResponse) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
  };

  const handleSaveJob = (newJob: Job) => {
    if (selectedJob) {
      // Update mode
      updateJobMutation({ id: selectedJob._id, data: newJob });
    } else {
      // Create mode
      createJobMutation(newJob);
    }
    handleCloseDialog();
  };

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
      {isLoggedIn() && (
        <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            onClick={handleOpenDialogForCreate}
          >
            <MdOutlineLibraryAdd size={20} />
            Create Job
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          filteredJobs.map((job, index) => (
            <JobCard
              key={index}
              job={job}
              onDelete={deleteJobMutation}
              onUpdate={handleOpenDialogForUpdate}
            />
          ))
        )}
      </Box>
      <CreateUpdateJob
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveJob}
        job={selectedJob} // Pass the currently selected job (if any) to the dialog
      />
    </Box>
  );
};

export default Jobs;
