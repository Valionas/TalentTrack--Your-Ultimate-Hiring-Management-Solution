import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BenefitsIcon from '@mui/icons-material/CardGiftcard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { JobResponse } from '../../packages/models/Job';

interface JobCardProps {
  job: JobResponse;
  onDelete: (id: string) => void;
  onUpdate: (job: JobResponse) => void;
  onApply: (job: JobResponse) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete, onUpdate, onApply }) => {
  /* ---------- auth helpers ---------- */
  const currentUser = localStorage.getItem('currentUser') || '';
  const isOwner = job.createdBy === currentUser;
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const alreadyApplied =
    job.applicants && job.applicants.includes(currentUser);

  const canApply = !isOwner && !isAdmin && !alreadyApplied;

  /* ---------- confirm dialog state ---------- */
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openDialog = () => setConfirmOpen(true);
  const closeDialog = () => setConfirmOpen(false);

  const handleConfirm = () => {
    closeDialog();
    onApply(job);
  };

  /* ---------- ui ---------- */
  return (
    <>
      <Card
        sx={{
          mb: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { transform: 'scale(1.02)', boxShadow: 4 },
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            {/* -------- job title & company -------- */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={job.companyLogo} alt={job.companyName} sx={{ width: 56, height: 56, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="subtitle2">{job.companyName}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* -------- details -------- */}
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                {job.location} | {job.type}
              </Typography>
              {job.salaryRange && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  <MonetizationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {job.salaryRange}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
                {job.experience}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
                {job.category}
              </Typography>
            </Grid>

            {/* -------- benefits -------- */}
            <Grid item xs={12} md={3}>
              {job.benefits.map((b, i) => (
                <Chip key={i} label={b} icon={<BenefitsIcon fontSize="small" />}
                  variant="outlined" sx={{ mr: 1, mb: 1 }} />
              ))}
            </Grid>

            {/* -------- actions & meta -------- */}
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                {(isOwner || isAdmin) && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Button variant="contained" size="small" startIcon={<EditIcon />} onClick={() => onUpdate(job)}>
                      Update
                    </Button>
                    <Button variant="contained" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => onDelete(job._id)}>
                      Delete
                    </Button>
                  </Box>
                )}

                {canApply && (
                  <Box sx={{ my: 1 }}>
                    <Button variant="outlined" color="success" onClick={openDialog}>
                      Apply
                    </Button>
                  </Box>
                )}

                <Box sx={{ borderTop: '1px solid #ddd', mt: 1, pt: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {job.datePosted}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Application Deadline: {job.applicationDeadline}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Job ID: {job.jobId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {job.contactEmail}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        {/* -------- skills -------- */}
        <CardContent>
          <Grid container spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
            {job.skills.map((skill, i) => (
              <Grid item key={i}><Chip label={skill} variant="outlined" /></Grid>
            ))}
          </Grid>
        </CardContent>

        {/* -------- description -------- */}
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {job.description}
          </Typography>
        </CardContent>
      </Card>

      {/* -------- confirmation dialog -------- */}
      <Dialog open={confirmOpen} onClose={closeDialog}>
        <DialogTitle>Confirm application?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to apply for&nbsp;“{job.title}” at {job.companyName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirm}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobCard;
