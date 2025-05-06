// pages/profile/Profile.tsx
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
  IconButton,
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
import EditIcon from '@mui/icons-material/Edit';

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
import { languages } from '../../constants/languages';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  /* ---------- state ---------- */
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number | null>(null);

  /* ---------- queries ---------- */
  const { data: profileData, isLoading: profileLoading, isError } = useUserProfileQuery();
  const { mutate: updateProfile, isLoading: updatingProfile } = useUpdateUserProfileMutation({
    onSuccess: () => {
      toast.success('Profile updated successfully!', { position: 'bottom-right' });
      // do not navigate away so the user can continue editing
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update profile', { position: 'bottom-right' });
    },
  });

  /* ---------- sync fetched data ---------- */
  useEffect(() => {
    if (profileData) {
      setEmployee(profileData);
    }
  }, [profileData]);

  /* ---------- generic save helper ---------- */
  const saveProfile = (next: UserProfile) => {
    setEmployee(next);
    updateProfile(next);
  };

  /* ---------- field handlers ---------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };
  const handleAutoChange = (field: keyof UserProfile, v: string) =>
    setEmployee({ ...employee, [field]: v });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      saveProfile({ ...employee, avatar: base64 });
    }
  };

  /* ---------- skills ---------- */
  const handleSkillsChange = (newSkills: string[]) => {
    saveProfile({ ...employee, skills: newSkills });
  };

  /* ---------- experience CRUD ---------- */
  const addExperience = (exp: WorkExperience) => {
    const next = {
      ...employee,
      workExperience: [...(employee.workExperience || []), exp],
    };
    saveProfile(next);
  };

  const updateExperience = (idx: number, exp: WorkExperience) => {
    const nextExp = [...(employee.workExperience || [])];
    nextExp[idx] = exp;
    const next = { ...employee, workExperience: nextExp };
    saveProfile(next);
  };

  const handleRemoveExperience = (idx: number) => {
    setSelectedExperienceIndex(idx);
    setConfirmationDialogOpen(true);
  };
  const confirmRemoveExperience = () => {
    if (selectedExperienceIndex != null) {
      const nextExp = (employee.workExperience || []).filter((_, i) => i !== selectedExperienceIndex);
      const next = { ...employee, workExperience: nextExp };
      saveProfile(next);
      setSelectedExperienceIndex(null);
      setConfirmationDialogOpen(false);
    }
  };

  /* ---------- dialog open helpers ---------- */
  const openAddDialog = () => {
    setEditingIndex(null);
    setEditingExperience(null);
    setDialogOpen(true);
  };
  const openEditDialog = (idx: number) => {
    setEditingIndex(idx);
    setEditingExperience(employee.workExperience![idx]);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setEditingIndex(null);
    setEditingExperience(null);
    setDialogOpen(false);
  };

  /* ---------- save from dialog ---------- */
  const handleSaveExperience = (exp: WorkExperience) => {
    if (editingIndex === null) {
      addExperience(exp);
    } else {
      updateExperience(editingIndex, exp);
    }
    closeDialog();
  };

  /* ---------- render ---------- */
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
        {/* LEFT column (details) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  image={employee.avatar || 'https://via.placeholder.com/150'}
                  alt="avatar"
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
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={employee.firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={employee.lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={industries}
                    value={employee.industry}
                    onChange={(_, v) => handleAutoChange('industry', v || '')}
                    renderInput={(p) => <TextField {...p} label="Industry" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Age"
                    name="age"
                    inputProps={{ min: 14 }}
                    value={employee.age}
                    onChange={(e) =>
                      setEmployee({
                        ...employee,
                        age: Math.max(14, Number(e.target.value) || 14),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={countries}
                    value={employee.country}
                    onChange={(_, v) => handleAutoChange('country', v || '')}
                    renderInput={(p) => <TextField {...p} label="Country" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={languages}
                    value={employee.language}
                    onChange={(_, v) => handleAutoChange('language', v || '')}
                    renderInput={(p) => <TextField {...p} label="Language" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={employee.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={employee.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={employee.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SkillsInput skills={employee.skills} setSkills={handleSkillsChange} />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => updateProfile(employee)}
                  disabled={updatingProfile}
                >
                  {updatingProfile ? 'Saving…' : 'Save All Changes'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT column (experience) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, overflowY: 'auto', maxHeight: '80vh' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Work Experience</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
                  Add Work Experience
                </Button>
              </Box>

              {employee.workExperience?.length ? (
                // SINGLE container with the history line:
                <Box sx={{ position: 'relative', pl: 4, borderLeft: '2px solid #e0e0e0' }}>
                  {employee.workExperience
                    .slice() // immutable copy
                    .sort((a, b) => {
                      // parse “to” dates; treat “Present” (or empty) as +∞
                      const parse = (d: string) =>
                        d.toLowerCase() === 'present' || !d
                          ? Infinity
                          : new Date(d).getTime();

                      const aEnd = parse(a.to);
                      const bEnd = parse(b.to);

                      if (bEnd !== aEnd) {
                        return bEnd - aEnd;
                      }
                      // tie-breaker: newer start date first
                      return new Date(b.from).getTime() - new Date(a.from).getTime();
                    })
                    .map((exp, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: 'relative',
                          mb: 4,

                          // make this a flex row
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                        }}
                      >
                        {/* the timeline dot */}
                        <Box
                          sx={{
                            position: 'absolute',
                            left: '-38px',
                            top: '4px',
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#3f51b5',
                          }}
                        />

                        {/* 80%: main content */}
                        <Box sx={{ width: '80%' }}>
                          <Typography variant="subtitle1">{exp.name}</Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            {exp.company} • {exp.from} – {exp.to}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                        </Box>

                        {/* 20%: action icons, aligned to the right */}
                        <Box
                          sx={{
                            width: '20%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1,
                          }}
                        >
                          <IconButton size="small" onClick={() => openEditDialog(idx)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleRemoveExperience(idx)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                </Box>
              ) : (
                <Typography>No work experience added yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* dialogs */}
      <AddExperienceDialog
        dialogOpen={dialogOpen}
        initialValues={editingExperience || undefined}
        onAdd={handleSaveExperience}
        setDialogOpen={setDialogOpen}
        onClose={closeDialog}
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

/* ---------- utils ---------- */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error || new Error('file read error'));
    r.readAsDataURL(file);
  });

const FullSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress />
  </Box>
);

export default Profile;
