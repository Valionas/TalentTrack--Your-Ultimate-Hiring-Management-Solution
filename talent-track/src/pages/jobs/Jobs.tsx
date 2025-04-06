import React, { useState, useEffect, useMemo } from 'react';
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
import {
  useJobsQuery,
  useCreateJobMutation,
  useDeleteJobMutation,
  useUpdateJobMutation,
} from '../../api/services/jobService';
import { isLoggedIn } from '../../utils/authUtils';
import CreateUpdateJob from './CreateUpdateJob';

// Import the contract service to create a contract
import { useCreateContractMutation } from '../../api/services/contractService';

import { JobResponse, Job } from '../../packages/models/Job';

/**
 * The Jobs component displays a list of jobs, allows searching, sorting, 
 * and creation/updating of job entries. 
 * It also provides an "Apply" button for non-owners to create a contract 
 * and update the job's applicants array.
 */
const Jobs: React.FC = () => {
  // State for searching/filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date');
  const [filteredJobs, setFilteredJobs] = useState<JobResponse[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [additionalSkills, setAdditionalSkills] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  // Dialog state (create/update job)
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);

  // Theme for consistent MUI styling
  const theme = useTheme();

  // Current user ID for applying
  const currentUserId = localStorage.getItem('currentUser') || '';

  // Fetch jobs
  const { data: jobs, isLoading, refetch: loadJobs } = useJobsQuery();

  // Mutations for Jobs
  const { mutate: createJobMutation } = useCreateJobMutation({
    onSuccess: () => {
      loadJobs();
    },
    onError: (error: any) => {
      console.error('Error creating job:', error);
    },
  });

  const { mutate: deleteJobMutation } = useDeleteJobMutation({
    onSuccess: () => {
      loadJobs();
    },
    onError: (error: any) => {
      console.error('Error deleting job:', error);
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

  // Mutation for creating a contract
  const { mutate: createContractMutation } = useCreateContractMutation({
    onSuccess: (contractCreated) => {
      console.log('Contract created:', contractCreated);
      // Possibly refetch contracts or show success
    },
    onError: (error) => {
      console.error('Error creating contract:', error);
    },
  });

  // Load / filter logic
  useEffect(() => {
    if (jobs) {
      filterJobs(searchTerm, selectedSkills, additionalSkills, selectedBenefits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, searchTerm, selectedSkills, additionalSkills, selectedBenefits]);

  /**
   * handleSearchChange - updates searchTerm and triggers filter
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterJobs(term, selectedSkills, additionalSkills, selectedBenefits);
  };

  /**
   * handleSortChange - changes the sort order and re-sorts the filtered list
   */
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const order = event.target.value;
    setSortOrder(order);
    sortJobs(filteredJobs, order);
  };

  /**
   * handleAdditionalSkillsChange - tracks multiple skill selections
   */
  const handleAdditionalSkillsChange = (
    event: React.SyntheticEvent,
    values: string[],
  ) => {
    setAdditionalSkills(values);
    filterJobs(searchTerm, selectedSkills, values, selectedBenefits);
  };

  /**
   * handleBenefitsChange - tracks multiple benefits selections
   */
  const handleBenefitsChange = (event: React.SyntheticEvent, values: string[]) => {
    setSelectedBenefits(values);
    filterJobs(searchTerm, selectedSkills, additionalSkills, values);
  };

  /**
   * filterJobs - filters the jobs based on searchTerm, skills, and benefits
   */
  const filterJobs = (
    term: string,
    skills: string[],
    extraSkills: string[],
    benefits: string[],
  ) => {
    if (!jobs) return;

    let filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.companyName.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term),
    );

    const allSkills = [...skills, ...extraSkills];

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

  /**
   * sortJobs - sorts the given jobs by date, asc, or desc
   */
  const sortJobs = (jobArray: JobResponse[], order: string) => {
    const sortedJobs = [...jobArray];
    if (order === 'date') {
      sortedJobs.sort(
        (a, b) =>
          new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
      );
    } else if (order === 'asc') {
      sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sortedJobs.sort((a, b) => b.title.localeCompare(a.title));
    }
    setFilteredJobs(sortedJobs);
  };

  // Helpers for unique skills/benefits
  const uniqueSkills = useMemo(() => {
    if (!jobs) return [];
    return Array.from(new Set(jobs.flatMap((job) => job.skills)));
  }, [jobs]);

  const benefitOptions = useMemo(() => {
    if (!jobs) return [];
    return Array.from(new Set(jobs.flatMap((job) => job.benefits)));
  }, [jobs]);

  /**
   * handleOpenDialogForCreate - opens the dialog in create mode
   */
  const handleOpenDialogForCreate = () => {
    setSelectedJob(null); // Clear selected job for creation
    setOpenDialog(true);
  };

  /**
   * handleOpenDialogForUpdate - opens the dialog in update mode with selected job
   */
  const handleOpenDialogForUpdate = (job: JobResponse) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  /**
   * handleCloseDialog - closes the job create/update dialog
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
  };

  /**
   * handleSaveJob - create or update a job based on whether selectedJob is set
   */
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

  /**
   * handleApply - the user (currentUserId) applies to a job:
   *  1. Create a contract with status='Applied'
   *  2. Update the job's applicants array
   */
  const handleApply = (job: JobResponse) => {
    if (!currentUserId) return;

    // 1) Create a contract
    createContractMutation({
      jobId: job._id,
      jobName: job.title,
      contactEmail: job.contactEmail,
      userId: currentUserId,
      status: 'Applied',
    });

    // 2) Update the job's applicants array (push the current user)
    const newApplicants = job.applicants ? [...job.applicants] : [];
    newApplicants.push(currentUserId);

    updateJobMutation({
      id: job._id,
      data: { ...job, applicants: newApplicants },
    });
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
                  icon={<CheckIcon style={{ color: theme.palette.primary.main }} />}
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
                  icon={<CheckIcon style={{ color: theme.palette.primary.main }} />}
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
            <Select value={sortOrder} onChange={handleSortChange} label="Sort By">
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
              onApply={handleApply}  // <-- pass apply handler here
            />
          ))
        )}
      </Box>

      {/* Dialog for creating/updating a Job */}
      <CreateUpdateJob
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveJob}
        job={selectedJob}
      />
    </Box>
  );
};

export default Jobs;
