import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Grid,
  OutlinedInput,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useAllUsersQuery } from '../../api/services/userService';
import { UserProfileResponse } from '../../packages/models/UserProfile';
import EmployeeCard from './EmployeeCard';

const industries = ['Technology', 'Healthcare', 'Finance', 'Education'];

const Employees: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<UserProfileResponse[]>([]);

  // Fetch all employees using the custom React Query hook
  const { data: employees, isLoading, isError } = useAllUsersQuery();

  useEffect(() => {
    if (employees) {
      filterEmployees(search, selectedIndustries, sortOrder);
    }
  }, [employees, search, selectedIndustries, sortOrder]);

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

  const filterEmployees = (searchText: string, industries: string[], order: string) => {
    if (!employees) return;

    let filtered = employees.filter((employee) => {
      // Combine firstName and lastName into a fullName string
      const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
      return (
        fullName.toLowerCase().includes(searchText.toLowerCase()) &&
        employee.industry &&
        (industries.length === 0 || industries.includes(employee.industry))
      );
    });

    if (order === 'asc') {
      filtered.sort((a, b) => {
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim();
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim();
        return nameA.localeCompare(nameB);
      });
    } else {
      filtered.sort((a, b) => {
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim();
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim();
        return nameB.localeCompare(nameA);
      });
    }

    setFilteredEmployees(filtered);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography variant="h6">Error fetching employees</Typography>;
  }

  return (
    <Box sx={{ py: 2, px: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Industries</InputLabel>
            <Select
              multiple
              value={selectedIndustries}
              onChange={handleIndustryChange}
              input={<OutlinedInput label="Industries" />}
              renderValue={(selected) => selected.join(', ')}
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
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOrder} onChange={handleSortChange} label="Sort By">
              <MenuItem value="asc">Name Ascending</MenuItem>
              <MenuItem value="desc">Name Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {filteredEmployees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} key={employee._id}>
              <EmployeeCard employee={employee} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Employees;
