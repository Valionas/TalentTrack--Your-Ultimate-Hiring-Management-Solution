import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  MenuItem,
  Grid,
  Avatar,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import { FaBuilding } from 'react-icons/fa';
import { Job } from '../../packages/models/Job';

const jobTypes = ['Full-Time', 'Part-Time', 'Contract'];

const CreateUpdateJob: React.FC<CreateUpdateJobProps> = ({
  open,
  onClose,
  onSave,
  job,
}) => {
  const [jobDetails, setJobDetails] = useState<Job>(
    job || {
      title: '',
      companyName: '',
      companyLogo: '',
      location: '',
      type: '',
      datePosted: new Date().toISOString().split('T')[0],
      skills: [],
      description: '',
      salaryRange: '',
      experience: '',
      contactEmail: '',
      category: '',
      benefits: [],
      applicationDeadline: new Date().toISOString().split('T')[0],
      jobId: '',
    },
  );
  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleAddSkill = () => {
    if (skillInput) {
      setJobDetails({
        ...jobDetails,
        skills: [...jobDetails.skills, skillInput],
      });
      setSkillInput('');
    }
  };

  const handleAddBenefit = () => {
    if (benefitInput) {
      setJobDetails({
        ...jobDetails,
        benefits: [...jobDetails.benefits, benefitInput],
      });
      setBenefitInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setJobDetails({ ...jobDetails, companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setJobDetails({
        ...jobDetails,
        [name]: date.toISOString().split('T')[0],
      });
    }
  };

  const handleSave = () => {
    onSave(jobDetails);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{job ? 'Update Job' : 'Create Job'}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Button
                  component="label"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    src={jobDetails.companyLogo}
                    sx={{ width: 150, height: 150, mb: 1 }}
                  >
                    {!jobDetails.companyLogo && <FaBuilding size={60} />}
                  </Avatar>
                  <input type="file" hidden onChange={handleFileChange} />
                  Upload Company Logo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Job Title"
                    name="title"
                    value={jobDetails.title}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company Name"
                    name="companyName"
                    value={jobDetails.companyName}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    name="location"
                    value={jobDetails.location}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Job Type"
                    name="type"
                    value={jobDetails.type}
                    onChange={handleChange}
                    select
                    fullWidth
                    required
                  >
                    {jobTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      label="Date Posted"
                      value={new Date(jobDetails.datePosted)}
                      onChange={(date) => handleDateChange('datePosted', date)}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Experience"
                    name="experience"
                    value={jobDetails.experience}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact Email"
                    name="contactEmail"
                    type="email"
                    value={jobDetails.contactEmail}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    name="category"
                    value={jobDetails.category}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Salary Range"
                    name="salaryRange"
                    value={jobDetails.salaryRange}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      label="Application Deadline"
                      value={new Date(jobDetails.applicationDeadline)}
                      onChange={(date) =>
                        handleDateChange('applicationDeadline', date)
                      }
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      label="Add Skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      fullWidth
                    />
                    <IconButton color="primary" onClick={handleAddSkill}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}
                  >
                    {jobDetails.skills.map((skill, index) => (
                      <Chip key={index} label={skill} />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      label="Add Benefit"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      fullWidth
                    />
                    <IconButton color="primary" onClick={handleAddBenefit}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}
                  >
                    {jobDetails.benefits.map((benefit, index) => (
                      <Chip key={index} label={benefit} />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={jobDetails.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface CreateUpdateJobProps {
  open: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
  job?: Job;
}

export default CreateUpdateJob;
