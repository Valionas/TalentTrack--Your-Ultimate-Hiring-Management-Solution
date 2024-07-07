// src/components/EmployeeCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Rating,
} from "@mui/material";
import { Employee } from "../../packages/models/Employee";

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
        <Avatar
          src={employee.avatar}
          alt={employee.name}
          sx={{ width: 80, height: 80, marginRight: 2 }}
        />
        <Box>
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
        </Box>
      </Box>
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginRight: 1 }}
            >
              Rating:
            </Typography>
            <Rating value={employee.rating} readOnly precision={0.1} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Skills: {employee.skills.join(", ")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

interface EmployeeCardProps {
  employee: Employee;
}

export default EmployeeCard;
