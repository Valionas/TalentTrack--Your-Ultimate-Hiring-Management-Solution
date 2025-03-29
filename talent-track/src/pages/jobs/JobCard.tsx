import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
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
  onUpdate: (job: any) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete, onUpdate }) => {
  // Assuming currentUser is stored in localStorage under 'currentUser'
  const currentUser = localStorage.getItem('currentUser');
  const isOwner = job.createdBy === currentUser;
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        },
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          {/* Job Title & Company */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={job.companyLogo}
                alt={job.companyName}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="subtitle2">{job.companyName}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Job Details */}
          <Grid item xs={12} md={3}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                {job.location} | {job.type}
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
            </Box>
          </Grid>

          {/* Benefits */}
          <Grid item xs={12} md={3}>
            <Box>
              {job.benefits.map((benefit: string, index: number) => (
                <Chip
                  key={index}
                  label={benefit}
                  icon={<BenefitsIcon fontSize="small" />}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Grid>

          {/* Actions & Additional Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              {/* Action Buttons */}
              {(isOwner || isAdmin) && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => onUpdate(job)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(job._id)}
                  >
                    Delete
                  </Button>
                </Box>
              )}

              {/* Divider */}
              <Box sx={{ borderTop: '1px solid #ddd', mt: 1, pt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {job.datePosted}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Application Deadline: {job.applicationDeadline}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Job ID: {job.jobId}
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

      {/* Skills Section */}
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              {job.skills.map((skill: string, index: number) => (
                <Grid item key={index}>
                  <Chip label={skill} variant="outlined" />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>

      {/* Description */}
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {job.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobCard;
