import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import AddExperienceDialog from './AddExperienceDialog';
import ConfirmationDialog from '../../common/confirmation-dialog/ConfirmationDialog';
import { WorkExperience, UserProfile } from '../../packages/models/UserProfile';
import {
  useUserProfileQuery,
  useUpdateUserProfileMutation,
} from '../../api/services/profileService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SkillsInput from './SkillsInput';

import { countries } from '../../constants/countries';
import { industries } from '../../constants/industries';
import { languages } from '../../constants/languages';           // NEW

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    industry: '',
    avatar: '',
    age: 0,
    country: '',
    skills: [],
    email: '',
    phone: '',
    address: '',
    language: '',
    workExperience: [],
  });

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number | null>(null);

  const { data: profileData, isLoading: profileLoading, isError } = useUserProfileQuery();

  const { mutate: updateProfile, isLoading: updatingProfile } =
    useUpdateUserProfileMutation({
      onSuccess: () => {
        toast.success('Profile updated successfully!', { position: 'bottom-right' });
        navigate('/profile');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update profile', { position: 'bottom-right' });
      },
    });

  useEffect(() => {
    if (profileData) {
      setEmployee(profileData);
      setWorkExperience(profileData.workExperience || []);
    }
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleAutoChange = (field: keyof UserProfile, value: string) => {
    setEmployee({ ...employee, [field]: value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64Image = await convertToBase64(file);
      setEmployee({ ...employee, avatar: base64Image });
    }
  };

  const handleAddExperience = (experience: WorkExperience) => {
    setWorkExperience([...workExperience, experience]);
    setEmployee({ ...employee, workExperience: [...workExperience, experience] });
  };

  const handleRemoveExperience = (index: number) => {
    setSelectedExperienceIndex(index);
    setConfirmationDialogOpen(true);
  };

  const confirmRemoveExperience = () => {
    if (selectedExperienceIndex !== null) {
      const updated = [...workExperience];
      updated.splice(selectedExperienceIndex, 1);
      setWorkExperience(updated);
      setEmployee({ ...employee, workExperience: updated });
      setSelectedExperienceIndex(null);
      setConfirmationDialogOpen(false);
    }
  };

  const handleSkillsChange = (newSkills: string[]) => {
    setEmployee({ ...employee, skills: newSkills });
  };

  const handleSubmit = () => updateProfile(employee);

  if (profileLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography variant="h6">Error fetching profile data</Typography>;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1400, m: 'auto' }}>
      <Grid container spacing={4}>
        {/* ---------- Left column ---------- */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  image={employee.avatar || 'https://via.placeholder.com/150'}
                  alt={`${employee.firstName} ${employee.lastName}` || employee.email}
                  sx={{ width: 170, height: 170, borderRadius: '50%' }}
                />
                <CardActions>
                  <Button variant="contained" component="label">
                    Upload Avatar
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                </CardActions>
              </Box>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                    value={employee.firstName}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    name="lastName"
                    value={employee.lastName}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={industries}
                    value={employee.industry}
                    onChange={(_, v) => handleAutoChange('industry', v || '')}
                    renderInput={(params) => <TextField {...params} label="Industry" fullWidth />}
                  />
                </Grid>
                {/* Age (minimum 14) */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Age"
                    variant="outlined"
                    type="number"
                    name="age"
                    value={employee.age}
                    inputProps={{ min: 14 }}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        setEmployee({ ...employee, age: Math.max(14, val) });
                      }
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={countries}
                    value={employee.country}
                    onChange={(_, v) => handleAutoChange('country', v || '')}
                    renderInput={(params) => <TextField {...params} label="Country" fullWidth />}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={languages}
                    value={employee.language}
                    onChange={(_, v) => handleAutoChange('language', v || '')}
                    renderInput={(params) => <TextField {...params} label="Language" fullWidth />}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={employee.email}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    variant="outlined"
                    name="phone"
                    value={employee.phone}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    variant="outlined"
                    name="address"
                    value={employee.address}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <SkillsInput skills={employee.skills} setSkills={handleSkillsChange} />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={updatingProfile}
                >
                  {updatingProfile ? 'Updating...' : 'Update Profile'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ---------- Right column ---------- */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, overflowY: 'auto', maxHeight: '80vh' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Work Experience
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
                  Add Work Experience
                </Button>
              </Box>

              {workExperience.length === 0 ? (
                <Typography>No work experience added yet.</Typography>
              ) : (
                <Timeline position="alternate">
                  {workExperience.map((exp, idx) => (
                    <TimelineItem key={idx}>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Card sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="subtitle1">{exp.name}</Typography>
                              <Typography variant="subtitle2">Company: {exp.company}</Typography>
                              <Typography variant="body2">
                                From: {exp.from} - To: {exp.to}
                              </Typography>
                              <Typography variant="body2">{exp.description}</Typography>
                            </Box>
                            <Button sx={{ minWidth: 'auto' }} onClick={() => handleRemoveExperience(idx)}>
                              <DeleteIcon />
                            </Button>
                          </Box>
                        </Card>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AddExperienceDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onAdd={handleAddExperience}
        onClose={() => setDialogOpen(false)}
      />

      <ConfirmationDialog
        open={confirmationDialogOpen}
        title="Confirm Deletion"
        content="Are you sure you want to delete this work experience? This action cannot be undone."
        onConfirm={confirmRemoveExperience}
        onCancel={() => setConfirmationDialogOpen(false)}
      />
    </Box>
  );
};

const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });

export default Profile;
