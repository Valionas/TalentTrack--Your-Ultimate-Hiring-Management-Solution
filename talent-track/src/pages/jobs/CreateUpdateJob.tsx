import React, { useEffect, useState } from 'react';
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
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaBuilding } from 'react-icons/fa';
import { Job, JobResponse } from '../../packages/models/Job';

const jobTypes = ['Full-Time', 'Part-Time', 'Contract'];
const emailRegex = /^\S+@\S+\.\S+$/;

interface CreateUpdateJobProps {
  open: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
  job: JobResponse | null;
}

const CreateUpdateJob: React.FC<CreateUpdateJobProps> = ({
  open,
  onClose,
  onSave,
  job,
}) => {
  const generateRandomJobId = () =>
    window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : Math.random().toString(36).substring(2, 18);

  const initial: Job = job
    ? { ...job }
    : {
      title: '',
      companyName: '',
      companyLogo: '',
      location: '',
      type: '',
      datePosted: new Date().toISOString().split('T')[0],
      applicationDeadline: new Date().toISOString().split('T')[0],
      skills: [],
      benefits: [],
      description: '',
      salaryRange: '',
      experience: '',
      contactEmail: '',
      category: '',
      jobId: generateRandomJobId(),
      createdBy: localStorage.getItem('currentUser') || '',
    };

  const [jobDetails, setJobDetails] = useState<Job>(initial);
  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof Job, string>>>({});
  const [touchedSubmit, setTouchedSubmit] = useState(false);

  // Reset state only when the dialog is opened
  useEffect(() => {
    if (open) {
      setJobDetails(initial);
      setSkillInput('');
      setBenefitInput('');
      setErrors({});
      setTouchedSubmit(false);
    }
  }, [open]);

  const validateField = (name: keyof Job, value: any): string => {
    switch (name) {
      case 'title':
        return value.trim() ? '' : 'Job title is required';
      case 'companyName':
        return value.trim() ? '' : 'Company name is required';
      case 'location':
        return value.trim() ? '' : 'Location is required';
      case 'type':
        return jobTypes.includes(value) ? '' : 'Job type is required';
      case 'datePosted':
        return value ? '' : 'Date posted is required';
      case 'applicationDeadline':
        if (!value) return 'Deadline is required';
        return new Date(value) >= new Date(jobDetails.datePosted)
          ? ''
          : 'Deadline must be on or after the posted date';
      case 'skills':
        return Array.isArray(value) && value.length > 0
          ? ''
          : 'At least one skill is required';
      case 'description':
        return value.trim() ? '' : 'Description is required';
      case 'experience':
        return value.trim() ? '' : 'Experience level is required';
      case 'contactEmail':
        return emailRegex.test(value) ? '' : 'A valid contact email is required';
      case 'category':
        return value.trim() ? '' : 'Category is required';
      default:
        return '';
    }
  };

  const validateAll = (): boolean => {
    const fields: (keyof Job)[] = [
      'title',
      'companyName',
      'location',
      'type',
      'datePosted',
      'applicationDeadline',
      'skills',
      'description',
      'experience',
      'contactEmail',
      'category',
    ];
    const newErrs: Partial<Record<keyof Job, string>> = {};
    fields.forEach(f => {
      newErrs[f] = validateField(f, (jobDetails as any)[f]);
    });
    setErrors(newErrs);
    return Object.values(newErrs).every(msg => !msg);
  };

  const handleSave = () => {
    setTouchedSubmit(true);
    if (!validateAll()) return; // stop if invalid
    onSave(jobDetails);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobDetails(jd => ({ ...jd, [name]: value }));
    if (touchedSubmit) {
      setErrors(errs => ({
        ...errs,
        [name]: validateField(name as keyof Job, value),
      }));
    }
  };

  const handleDateChange = (field: keyof Job, date: Date | null) => {
    const value = date ? date.toISOString().split('T')[0] : '';
    setJobDetails(jd => ({ ...jd, [field]: value }));
    if (touchedSubmit) {
      setErrors(errs => ({
        ...errs,
        [field]: validateField(field, value),
      }));
    }
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const updated = [...jobDetails.skills, skillInput.trim()];
    setJobDetails(jd => ({ ...jd, skills: updated }));
    if (touchedSubmit) {
      setErrors(errs => ({
        ...errs,
        skills: validateField('skills', updated),
      }));
    }
    setSkillInput('');
  };

  const handleAddBenefit = () => {
    if (!benefitInput.trim()) return;
    setJobDetails(jd => ({
      ...jd,
      benefits: [...jd.benefits, benefitInput.trim()],
    }));
    setBenefitInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setJobDetails(jd => ({
        ...jd,
        companyLogo: reader.result as string,
      }));
    reader.readAsDataURL(file);
  };

  const hasError = Object.values(errors).some(msg => !!msg);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{job ? 'Update Job' : 'Create Job'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {/* Logo Upload */}
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Button component="label">
                  <Avatar
                    src={jobDetails.companyLogo}
                    sx={{ width: 120, height: 120, mb: 1 }}
                  >
                    {!jobDetails.companyLogo && <FaBuilding size={60} />}
                  </Avatar>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="caption" display="block">
                  Optional logo
                </Typography>
              </Box>
            </Grid>

            {/* Core Fields */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                {/* Title */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="title"
                    label="Job Title"
                    value={jobDetails.title}
                    onChange={handleChange}
                    error={touchedSubmit && !!errors.title}
                    helperText={touchedSubmit ? errors.title : ''}
                    required
                    fullWidth
                  />
                </Grid>
                {/* Company */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="companyName"
                    label="Company Name"
                    value={jobDetails.companyName}
                    onChange={handleChange}
                    error={touchedSubmit && !!errors.companyName}
                    helperText={touchedSubmit ? errors.companyName : ''}
                    required
                    fullWidth
                  />
                </Grid>
                {/* Location */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="location"
                    label="Location"
                    value={jobDetails.location}
                    onChange={handleChange}
                    error={touchedSubmit && !!errors.location}
                    helperText={touchedSubmit ? errors.location : ''}
                    required
                    fullWidth
                  />
                </Grid>
                {/* Type */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    name="type"
                    label="Job Type"
                    value={jobDetails.type}
                    onChange={handleChange}
                    error={touchedSubmit && !!errors.type}
                    helperText={touchedSubmit ? errors.type : ''}
                    required
                    fullWidth
                  >
                    {jobTypes.map(t => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {/* Date Posted */}
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date Posted"
                      value={new Date(jobDetails.datePosted)}
                      onChange={d => handleDateChange('datePosted', d)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: touchedSubmit && !!errors.datePosted,
                          helperText: touchedSubmit ? errors.datePosted : '',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                {/* Deadline */}
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Application Deadline"
                      value={new Date(jobDetails.applicationDeadline)}
                      onChange={d =>
                        handleDateChange('applicationDeadline', d)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error:
                            touchedSubmit && !!errors.applicationDeadline,
                          helperText: touchedSubmit
                            ? errors.applicationDeadline
                            : '',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                {/* Experience */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="experience"
                    label="Experience"
                    value={jobDetails.experience}
                    onChange={handleChange}
                    error={touchedSubmit && !!errors.experience}
                    helperText={touchedSubmit ? errors.experience : ''}
                    required
                    fullWidth
                  />
                </Grid>
                {/* Contact Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="contactEmail"
                    label="Contact Email"
                    type="email"
                    value={jobDetails.contactEmail}
                    onChange={handleChange}
                    error={touchedSubmit && !!errors.contactEmail}
                    helperText={touchedSubmit ? errors.contactEmail : ''}
                    required
                    fullWidth
                  />
                </Grid>
                {/* Category */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="category"
                    label="Category"
                    value={jobDetails.category}
                    onChange={handleChange}
                    error={touchedSubmit && !!errors.category}
                    helperText={touchedSubmit ? errors.category : ''}
                    required
                    fullWidth
                  />
                </Grid>
                {/* Salary Range */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="salaryRange"
                    label="Salary Range"
                    value={jobDetails.salaryRange}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Skills */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Skill"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  fullWidth
                />
                <IconButton onClick={handleAddSkill}>
                  <AddIcon />
                </IconButton>
              </Box>
              {touchedSubmit && errors.skills && (
                <Typography color="error" variant="caption">
                  {errors.skills}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {jobDetails.skills.map((skill, i) => (
                  <Chip
                    key={`skill-${i}`}
                    label={skill}
                    onDelete={() => {
                      setJobDetails(jd => ({
                        ...jd,
                        skills: jd.skills.filter((s, idx) => idx !== i),
                      }));
                    }}
                    deleteIcon={<DeleteIcon />}
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Benefits */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Benefit"
                  value={benefitInput}
                  onChange={e => setBenefitInput(e.target.value)}
                  fullWidth
                />
                <IconButton onClick={handleAddBenefit}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {jobDetails.benefits.map((benefit, i) => (
                  <Chip
                    key={`benefit-${i}`}
                    label={benefit}
                    onDelete={() => {
                      setJobDetails(jd => ({
                        ...jd,
                        benefits: jd.benefits.filter((b, idx) => idx !== i),
                      }));
                    }}
                    deleteIcon={<DeleteIcon />}
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={jobDetails.description}
                onChange={handleChange}
                error={touchedSubmit && !!errors.description}
                helperText={touchedSubmit ? errors.description : ''}
                multiline
                rows={4}
                required
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSave}
          disabled={hasError && touchedSubmit}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUpdateJob;
