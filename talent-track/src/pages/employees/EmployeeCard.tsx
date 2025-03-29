import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import Rating from '@mui/material/Rating';
import { UserProfile } from '../../packages/models/UserProfile';

interface EmployeeCardProps {
  employee: UserProfile;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  return (
    <Card
      sx={{
        // Fixed height for demonstration (can adjust as needed)
        height: 250,
        display: 'flex',
        // For xs screens, use column layout; for sm+ screens, row layout
        flexDirection: { sm: 'column', md: 'row' },
        // Scroll if content overflows
        overflow: 'auto',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        },
        mb: 2,
        // Center items on both xs and sm, but can adjust if desired
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 4
      }}
    >
      <Avatar
        src={employee.avatar}
        alt={`${employee.firstName} ${employee.lastName}`}
        sx={{ width: 80, height: 80, m: 2, flexShrink: 0 }}
      />

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6">
          {employee.firstName} {employee.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Industry: {employee.industry || 'Not specified'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Age: {employee.age}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Country: {employee.country}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Rating:
          </Typography>
          <Rating value={employee.rating} precision={0.5} readOnly />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Skills: {employee.skills ? employee.skills.join(', ') : '-'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
