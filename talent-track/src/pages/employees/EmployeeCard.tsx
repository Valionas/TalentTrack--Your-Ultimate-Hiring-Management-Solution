// src/pages/employees/EmployeeCard.tsx
import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import Rating from "@mui/material/Rating";
import { Employee } from "../../packages/models/Employee";

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Avatar
        src={employee.avatar}
        alt={employee.name}
        sx={{ width: 80, height: 80, margin: 2 }}
      />
      <CardContent>
        <Typography variant="h6">{employee.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Industry: {employee.industry}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Age: {employee.age}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Country: {employee.country}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Rating:
          </Typography>
          <Rating value={employee.rating} precision={0.5} readOnly />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Skills: {employee.skills.join(", ")}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface EmployeeCardProps {
  employee: Employee;
}

export default EmployeeCard;
