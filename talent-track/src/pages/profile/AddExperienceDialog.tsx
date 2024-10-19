import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  DialogActions,
  Typography,
  Dialog,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { WorkExperience } from '../../packages/models/UserProfile';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddExperienceDialog: React.FC<AddExperienceDialogProps> = ({
  onAdd,
  onClose,
  dialogOpen,
  setDialogOpen,
}) => {
  const [newExperience, setNewExperience] = useState<WorkExperience>({
    name: '',
    company: '',
    from: '',
    to: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    company: false,
    from: false,
    to: false,
  });

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExperience({ ...newExperience, [name]: value });
    setErrors({ ...errors, [name]: value === '' });
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setNewExperience({
        ...newExperience,
        [name]: date.toISOString().split('T')[0],
      });
      setErrors({ ...errors, [name]: date === null });
    }
  };

  const handleAddExperience = () => {
    const { name, company, from, to } = newExperience;
    if (name && company && from && to) {
      onAdd(newExperience);
      onClose();
    } else {
      setErrors({
        name: name === '',
        company: company === '',
        from: from === '',
        to: to === '',
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <Box sx={{ padding: 4, width: 400 }}>
        <Typography variant="h6" gutterBottom>
          Add Work Experience
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Job Title"
            variant="outlined"
            name="name"
            value={newExperience.name}
            onChange={handleExperienceChange}
            fullWidth
            error={errors.name}
            helperText={errors.name && 'Job title is required'}
          />
          <TextField
            label="Company"
            variant="outlined"
            name="company"
            value={newExperience.company}
            onChange={handleExperienceChange}
            fullWidth
            error={errors.company}
            helperText={errors.company && 'Company name is required'}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From"
              onChange={(date) => handleDateChange('from', date)}
            />
            <DatePicker
              label="To"
              onChange={(date) => handleDateChange('to', date)}
            />
          </LocalizationProvider>

          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            name="description"
            value={newExperience.description}
            onChange={handleExperienceChange}
            fullWidth
          />
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddExperience}
              color="primary"
            >
              Add
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};

interface AddExperienceDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  onAdd: (experience: WorkExperience) => void;
  onClose: () => void;
}

export default AddExperienceDialog;
