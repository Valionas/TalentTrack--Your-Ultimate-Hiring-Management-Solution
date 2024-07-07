// src/pages/employees/Employees.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Typography,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { employees as employeeData } from "./mockData";
import { Employee } from "../../packages/models/Employee";
import EmployeeCard from "./EmployeeCard";

const industries = ["Technology", "Healthcare", "Finance", "Education"];

const Employees: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [filteredEmployees, setFilteredEmployees] =
    useState<Employee[]>(employeeData);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    filterEmployees(e.target.value, selectedIndustries, sortOrder);
  };

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    const order = e.target.value as string;
    setSortOrder(order);
    filterEmployees(search, selectedIndustries, order);
  };

  const handleIndustryChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const value = event.target.value as string[];
    setSelectedIndustries(value);
    filterEmployees(search, value, sortOrder);
  };

  const filterEmployees = (
    searchText: string,
    industries: string[],
    order: string,
  ) => {
    let filtered = employeeData.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchText.toLowerCase()) &&
        (industries.length === 0 || industries.includes(employee.industry)),
    );

    if (order === "asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredEmployees(filtered);
  };

  return (
    <Box sx={{ display: "flex", padding: 2 }}>
      <Box sx={{ width: 200, marginRight: 2 }}>
        <Typography variant="h6">Industries</Typography>
        {industries.map((industry) => (
          <FormControl key={industry} sx={{ display: "flex" }}>
            <Checkbox
              checked={selectedIndustries.includes(industry)}
              onChange={handleIndustryChange}
              value={industry}
            />
            <ListItemText primary={industry} />
          </FormControl>
        ))}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            marginBottom: 2,
            gap: 1,
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
          />
          <FormControl variant="outlined">
            <InputLabel>Sort</InputLabel>
            <Select value={sortOrder} onChange={handleSortChange} label="Sort">
              <MenuItem value="asc">ASC</MenuItem>
              <MenuItem value="desc">DESC</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={2}>
          {filteredEmployees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} key={employee.id}>
              <EmployeeCard employee={employee} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Employees;
