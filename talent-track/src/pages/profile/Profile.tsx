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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
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
import SkillsInput from './SkillsInput'; // Import your SkillsInput component

const industries = ['Technology', 'Healthcare', 'Finance', 'Education'];
const countries = ['USA', 'Canada', 'UK', 'Australia', 'New Zealand'];
const languages = ['English', 'French', 'Spanish', 'German', 'Chinese'];

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<UserProfile>({
    name: '',
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
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
    number | null
  >(null);

  // Fetch user profile using react-query
  const {
    data: profileData,
    isLoading: profileLoading,
    isError,
  } = useUserProfileQuery();

  // Update user profile mutation
  const { mutate: updateProfile, isLoading: updatingProfile } =
    useUpdateUserProfileMutation({
      onSuccess: () => {
        toast.success('Profile updated successfully!', {
          position: 'bottom-right',
        });
        navigate('/profile');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update profile', {
          position: 'bottom-right',
        });
      },
    });

  // When the profile data is fetched, update the employee state
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

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64Image = await convertToBase64(file); // Add a helper to convert to Base64
      setEmployee({ ...employee, avatar: base64Image });
    }
  };

  const handleAddExperience = (experience: WorkExperience) => {
    setWorkExperience([...workExperience, experience]);
    setEmployee({
      ...employee,
      workExperience: [...workExperience, experience],
    });
  };

  const handleRemoveExperience = (index: number) => {
    setSelectedExperienceIndex(index);
    setConfirmationDialogOpen(true);
  };

  const confirmRemoveExperience = () => {
    if (selectedExperienceIndex !== null) {
      const updatedExperience = [...workExperience];
      updatedExperience.splice(selectedExperienceIndex, 1);
      setWorkExperience(updatedExperience);
      setEmployee({ ...employee, workExperience: updatedExperience });
      setSelectedExperienceIndex(null);
      setConfirmationDialogOpen(false);
    }
  };

  const handleSkillsChange = (newSkills: string[]) => {
    setEmployee({ ...employee, skills: newSkills });
  };

  const handleSubmit = () => {
    updateProfile(employee);
  };

  if (profileLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography variant="h6">Error fetching profile data</Typography>;
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 1400, margin: 'auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CardMedia
                  component="img"
                  image={employee.avatar || 'https://via.placeholder.com/150'}
                  alt={employee.name}
                  sx={{ width: 170, height: 170, borderRadius: '50%' }}
                />
                <CardActions>
                  <Button variant="contained" component="label">
                    Upload Avatar
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </CardActions>
              </Box>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={employee.name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Industry</InputLabel>
                    <Select
                      name="industry"
                      value={employee.industry}
                      onChange={handleSelectChange}
                      label="Industry"
                    >
                      {industries.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Age"
                    variant="outlined"
                    type="number"
                    name="age"
                    value={employee.age}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      name="country"
                      value={employee.country}
                      onChange={handleSelectChange}
                      label="Country"
                    >
                      {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      name="language"
                      value={employee.language}
                      onChange={handleSelectChange}
                      label="Language"
                    >
                      {languages.map((language) => (
                        <MenuItem key={language} value={language}>
                          {language}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                <Grid item xs={12} sm={6}>
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
                  {/* Use SkillsInput Component */}
                  <SkillsInput
                    skills={employee.skills || []}
                    setSkills={handleSkillsChange}
                  />
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

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ flex: 1, overflowY: 'auto', maxHeight: '80vh' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Work Experience
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setDialogOpen(true)}
                  sx={{ position: 'sticky', top: 0 }}
                >
                  Add Work Experience
                </Button>
              </Box>
              {workExperience.length === 0 ? (
                <Typography variant="body1">
                  No work experience added yet.
                </Typography>
              ) : (
                <Timeline position="alternate">
                  {workExperience.map((experience, index) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Card sx={{ padding: 2, position: 'relative' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle1">
                                {experience.name}
                              </Typography>
                              <Typography variant="subtitle2">
                                Company: {experience.company}
                              </Typography>
                              <Typography variant="body2">
                                From: {experience.from} - To: {experience.to}
                              </Typography>
                              <Typography variant="body2">
                                {experience.description}
                              </Typography>
                            </Box>
                            <Button
                              sx={{ minWidth: 'auto' }}
                              onClick={() => handleRemoveExperience(index)}
                            >
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

// Helper to convert image file to Base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default Profile;
