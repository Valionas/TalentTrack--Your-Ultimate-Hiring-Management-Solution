import React, { useState, MouseEvent } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Collapse,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BenefitsIcon from '@mui/icons-material/CardGiftcard';
import CodeIcon from '@mui/icons-material/Code';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import { JobResponse } from '../../packages/models/Job';
import { isLoggedIn } from '../../utils/authUtils';
import SendIcon from '@mui/icons-material/Send'; // Use a "send" icon for apply
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For "Applied"

import ConfirmApplyDialog from './ConfirmApplyDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

interface JobCardProps {
  job: JobResponse;
  onDelete: (id: string) => void;
  onUpdate: (job: JobResponse) => void;
  onApply: (job: JobResponse) => void;
}

const ActionBox = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
});

const JobCard: React.FC<JobCardProps> = ({
  job,
  onDelete,
  onUpdate,
  onApply,
}) => {
  /* ---------- auth helpers ---------- */
  const currentUser = localStorage.getItem('currentUser') || '';
  const isOwner = job.createdBy === currentUser;
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const alreadyApplied = job.applicants?.includes(currentUser);
  const canApply = !isOwner && !isAdmin && !alreadyApplied;

  /* ---------- local state ---------- */
  const [applyOpen, setApplyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  /* ---------- handlers ---------- */
  const handleCardClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-actions]')) return;
    setExpanded((prev) => !prev);
  };

  const handleApplyConfirm = () => {
    setApplyOpen(false);
    onApply(job);
  };

  const handleDeleteConfirm = () => {
    setDeleteOpen(false);
    onDelete(job._id);
  };

  /* ---------- ui ---------- */
  return (
    <>
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          transition: 'transform 0.15s, box-shadow 0.15s',
          '&:hover': { transform: 'scale(1.015)', boxShadow: 4 },
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
          <Grid container spacing={1} alignItems="center">
            {/* ------ title & company ------ */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={job.companyLogo}
                  alt={job.companyName}
                  sx={{ width: 50, height: 50, mr: 1.5 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.companyName}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* ------ quick facts ------ */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {job.location} | {job.type}
                </Typography>
                {job.salaryRange && (
                  <Typography variant="body2" color="text.secondary">
                    <MonetizationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {job.salaryRange}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {job.experience}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {job.category}
                </Typography>
              </Box>
            </Grid>

            {/* ------ skills + benefits tags ------ */}
            <Grid item xs={12} md={3}>
              {job.skills.slice(0, 3).map((skill, i) => (
                <Chip
                  key={`skill-${i}`}
                  size="small"
                  label={skill}
                  icon={<LightbulbIcon fontSize="small" />}
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
              {job.skills.length > 3 && (
                <Chip
                  size="small"
                  label={`+${job.skills.length - 3} skills`}
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              )}

              {job.benefits.slice(0, 3).map((b, i) => (
                <Chip
                  key={`benefit-${i}`}
                  size="small"
                  label={b}
                  icon={<BenefitsIcon fontSize="small" />}
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
              {job.benefits.length > 3 && (
                <Chip
                  size="small"
                  label={`+${job.benefits.length - 3} benefits`}
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              )}
            </Grid>

            {/* ------ actions ------ */}
            <Grid item xs={12} md={2}>
              <ActionBox data-actions>
                {(isOwner || isAdmin) && (
                  <>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => onUpdate(job)}
                    >
                      Update
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteOpen(true)}
                    >
                      Delete
                    </Button>
                  </>
                )}

                {isLoggedIn() && alreadyApplied && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    disabled
                  >
                    Applied
                  </Button>
                )}

                {isLoggedIn() && canApply && (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => setApplyOpen(true)}
                    startIcon={<SendIcon />}
                  >
                    Apply
                  </Button>
                )}

                <Button
                  size="small"
                  sx={{ minWidth: 32 }}
                  aria-label={expanded ? 'collapse details' : 'expand details'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((prev) => !prev);
                  }}
                >
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
              </ActionBox>
            </Grid>
          </Grid>
        </CardContent>

        {/* ---------- details section ---------- */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {job.skills.map((skill, i) => (
                <Chip key={i} label={skill} size="small" variant="outlined" />
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {job.description}
            </Typography>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={4} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Posted:&nbsp;{job.datePosted}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Deadline:&nbsp;{job.applicationDeadline}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Job ID:&nbsp;{job.jobId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {job.contactEmail}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>

      {/* ---------- confirmation dialogs ---------- */}
      <ConfirmApplyDialog
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onConfirm={handleApplyConfirm}
        jobTitle={job.title}
        companyName={job.companyName}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        jobTitle={job.title}
      />
    </>
  );
};

export default JobCard;
