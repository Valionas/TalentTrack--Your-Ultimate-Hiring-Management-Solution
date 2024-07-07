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
  OutlinedInput,
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
    const order = e.target.value;
    setSortOrder(order);
    filterEmployees(search, selectedIndustries, order);
  };

  const handleIndustryChange = (event: SelectChangeEvent<string[]>) => {
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
    <Box sx={{ display: "flex", padding: 2, flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          marginBottom: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            sx={{ width: { xs: "100%", md: "auto" } }}
          />
          <FormControl
            variant="outlined"
            sx={{ width: { xs: "100%", md: 200 } }}
          >
            <InputLabel>Industries</InputLabel>
            <Select
              multiple
              value={selectedIndustries}
              onChange={handleIndustryChange}
              input={<OutlinedInput label="Industries" />}
              renderValue={(selected) => selected.join(", ")}
              placeholder="Select Industries"
            >
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  <Checkbox checked={selectedIndustries.includes(industry)} />
                  <ListItemText primary={industry} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{ width: { xs: "100%", md: 100 } }}
          >
            <InputLabel>Sort</InputLabel>
            <Select value={sortOrder} onChange={handleSortChange} label="Sort">
              <MenuItem value="asc">ASC</MenuItem>
              <MenuItem value="desc">DESC</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {filteredEmployees.map((employee) => (
          <Grid item xs={12} sm={6} md={4} key={employee.id}>
            <EmployeeCard employee={employee} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Employees;
