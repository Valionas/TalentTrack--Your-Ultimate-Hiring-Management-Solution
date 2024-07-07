import React, { useState } from "react";
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
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import AddExperienceDialog from "./AddExperienceDialog";

import { WorkExperience } from "../../packages/models/Employee";
import ConfirmationDialog from "../../common/confirmation-dialog/ConfirmationDialog";

const industries = ["Technology", "Healthcare", "Finance", "Education"];
const countries = ["USA", "Canada", "UK", "Australia", "New Zealand"];

const Profile: React.FC = () => {
  const [employee, setEmployee] = useState({
    name: "",
    industry: "",
    avatar: "",
    age: 0,
    country: "",
    skills: "",
  });

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
    number | null
  >(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployee({ ...employee, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExperience = (experience: WorkExperience) => {
    setWorkExperience([...workExperience, experience]);
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
      setSelectedExperienceIndex(null);
      setConfirmationDialogOpen(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "auto" }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <CardMedia
              component="img"
              image={employee.avatar || "https://via.placeholder.com/150"}
              alt={employee.name}
              sx={{ width: 170, height: 170, borderRadius: "50%" }}
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
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={employee.name}
                  onChange={handleInputChange}
                  fullWidth
                />
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
                <TextField
                  label="Age"
                  variant="outlined"
                  type="number"
                  name="age"
                  value={employee.age}
                  onChange={handleInputChange}
                  fullWidth
                />
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
                <TextField
                  label="Skills"
                  variant="outlined"
                  multiline
                  rows={4}
                  name="skills"
                  value={employee.skills}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ boxShadow: 3, borderRadius: 2, marginTop: 4, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Work Experience
        </Typography>
        {workExperience.length === 0 ? (
          <Typography variant="body1">No work experience added yet.</Typography>
        ) : (
          <Timeline position="alternate">
            {workExperience.map((experience, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card sx={{ padding: 2, position: "relative" }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          Job Title: {experience.name}
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
                        sx={{ minWidth: "auto" }}
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ marginTop: 2 }}
        >
          Add Work Experience
        </Button>
      </Card>
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

export default Profile;
