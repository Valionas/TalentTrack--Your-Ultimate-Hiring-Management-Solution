import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, ButtonBase } from '@mui/material';
import Rating from '@mui/material/Rating';
import { UserProfile } from '../../packages/models/UserProfile';

interface Props {
  employee: UserProfile;
  onClick?: () => void;           // 🔸 new (optional) click handler
}

const EmployeeCard: React.FC<Props> = ({ employee, onClick }) => (
  <ButtonBase
    onClick={onClick}
    sx={{ width: '100%', textAlign: 'left', borderRadius: 1 }}
  >
    <Card
      sx={{
        height: 250,
        display: 'flex',
        flexDirection: { sm: 'column', md: 'row' },
        overflow: 'auto',
        width: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'scale(1.02)', boxShadow: 4 },
        mb: 2,
        alignItems: 'center',
        justifyContent: 'center',
        pt: 4,
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

        {employee.skills && employee.skills.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Skills: {employee.skills.join(', ')}
          </Typography>
        )}
      </CardContent>
    </Card>
  </ButtonBase>
);

export default EmployeeCard;
