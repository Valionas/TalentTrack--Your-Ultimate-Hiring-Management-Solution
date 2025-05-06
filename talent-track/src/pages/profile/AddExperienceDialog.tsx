// components/profile/AddExperienceDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  DialogActions,
  Typography,
  Dialog,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { WorkExperience } from '../../packages/models/UserProfile';

/* ------------------------------------------------------------------ */
const emptyExp: WorkExperience = {
  name: '', company: '', from: '', to: '', description: '',
};

const AddExperienceDialog: React.FC<Props> = ({
  dialogOpen,
  setDialogOpen,
  initialValues,          // ← optional when editing
  onAdd,                  // parent decides add vs. update
  onClose,
}) => {
  /* -------- local state -------- */
  const [experience, setExperience] = useState<WorkExperience>(emptyExp);
  const [errors, setErrors] = useState<Record<keyof WorkExperience, boolean>>(
    { name: false, company: false, from: false, to: false, description: false },
  );

  /* -------- reset state each time dialog opens -------- */
  useEffect(() => {
    if (dialogOpen) {
      setExperience(initialValues ?? emptyExp);
      setErrors({ name: false, company: false, from: false, to: false, description: false });
    }
  }, [dialogOpen, initialValues]);

  /* -------- handlers -------- */
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExperience(prev => ({ ...prev, [name]: value }));
    if (value) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleDateChange = (field: 'from' | 'to', date: Date | null) => {
    setExperience(prev => ({ ...prev, [field]: date ? date.toISOString().split('T')[0] : '' }));
    setErrors(prev => ({ ...prev, [field]: !date }));
  };

  const validate = () => {
    const newErrs = {
      name: !experience.name,
      company: !experience.company,
      from: !experience.from,
      to: !experience.to,
      description: false,
    };
    setErrors(newErrs);
    return !Object.values(newErrs).some(Boolean);
  };

  const handleSave = () => {
    if (validate()) {
      onAdd(experience);   // parent decides whether it's “add” or “update”
      onClose();
    }
  };

  /* -------- render -------- */
  const isEdit = Boolean(initialValues);

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <Box sx={{ p: 4, width: { xs: 320, sm: 400 } }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? 'Edit Work Experience' : 'Add Work Experience'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Job Title" name="name" fullWidth required
            value={experience.name} onChange={handleTextChange}
            error={errors.name} helperText={errors.name && 'Job title is required'}
          />
          <TextField
            label="Company" name="company" fullWidth required
            value={experience.company} onChange={handleTextChange}
            error={errors.company} helperText={errors.company && 'Company is required'}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From" slotProps={{
                textField: {
                  required: true, error: errors.from,
                  helperText: errors.from && 'Required'
                }
              }}
              value={experience.from ? new Date(experience.from) : null}
              onChange={(d) => handleDateChange('from', d)}
            />
            <DatePicker
              label="To" slotProps={{
                textField: {
                  required: true, error: errors.to,
                  helperText: errors.to && 'Required'
                }
              }}
              value={experience.to ? new Date(experience.to) : null}
              onChange={(d) => handleDateChange('to', d)}
            />
          </LocalizationProvider>

          <TextField
            label="Description" name="description" fullWidth multiline rows={4}
            value={experience.description} onChange={handleTextChange}
          />

          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              startIcon={isEdit ? <SaveIcon /> : <AddIcon />}
              onClick={handleSave}
            >
              {isEdit ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};

/* ------------------------------------------------------------------ */
interface Props {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onAdd: (exp: WorkExperience) => void;        // called for add *and* edit
  onClose: () => void;
  initialValues?: WorkExperience;                // present when editing
}

export default AddExperienceDialog;
