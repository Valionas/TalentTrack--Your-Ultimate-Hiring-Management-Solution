import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  CircularProgress,
  Typography,
  Autocomplete,
} from '@mui/material';
import { useAllUsersQuery, useRateUserMutation } from '../../api/services/userService';
import { UserProfileResponse } from '../../packages/models/UserProfile';
import EmployeeCard from './EmployeeCard';
import EmployeeProfileDialog from './EmployeeProfileDialog';
import { industries } from '../../constants/industries';
import { countries } from '../../constants/countries';
import { toast } from 'react-toastify';

type SortOpt = 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc';

const Employees: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOpt>('nameAsc');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<UserProfileResponse[]>([]);

  /* ---------- dialog ---------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeEmp, setActiveEmp] = useState<UserProfileResponse | null>(null);

  const { data: employees, isLoading, isError, refetch: loadUsers } = useAllUsersQuery();

  const rateUserMutation = useRateUserMutation({
    onSuccess: () => { toast.success('Rating submitted!'); loadUsers(); },
    onError: () => { toast.error('Failed to submit rating'); },
  });

  /* ---------- filter helper ---------- */
  const filterEmployees = (
    q: string,
    ind: string,
    ctr: string,
    order: SortOpt
  ) => {
    if (!employees) return;
    let list = employees.filter((e) => {
      const full = `${e.firstName} ${e.lastName}`.toLowerCase();
      const nOK = full.includes(q.toLowerCase());
      const iOK = ind ? e.industry === ind : true;
      const cOK = ctr ? e.country === ctr : true;
      return nOK && iOK && cOK;
    });

    list.sort((a, b) => {
      switch (order) {
        case 'ageAsc':
          return (a.age ?? 0) - (b.age ?? 0);
        case 'ageDesc':
          return (b.age ?? 0) - (a.age ?? 0);
        case 'nameDesc':
          return `${b.firstName} ${b.lastName}`.localeCompare(
            `${a.firstName} ${a.lastName}`
          );
        default:
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
      }
    });
    setFilteredEmployees(list);
  };

  /* ---------- side effects ---------- */
  useEffect(() => {
    if (employees) filterEmployees(search, selectedIndustry, selectedCountry, sortOrder);
  }, [employees, search, selectedIndustry, selectedCountry, sortOrder]);

  /* ---------- dialog helpers ---------- */
  const openDialog = (emp: UserProfileResponse) => {
    setActiveEmp(emp);
    setDialogOpen(true);
  };
  const closeDialog = () => setDialogOpen(false);

  const handleMessage = (emp: UserProfileResponse) =>
    console.log('message →', emp.email);

  const handleRate = (emp: UserProfileResponse, grade: number) => {
    rateUserMutation.mutate({ userId: emp._id.toString(), grade });
  };


  /* ---------- loading / error ---------- */
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  if (isError) return <Typography>Error fetching employees</Typography>;

  /* ---------- render ---------- */
  return (
    <Box sx={{ py: 2, px: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField fullWidth label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            options={industries}
            value={selectedIndustry}
            onChange={(_, v) => setSelectedIndustry(v || '')}
            renderInput={(p) => <TextField {...p} label="Industry" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            options={countries}
            value={selectedCountry}
            onChange={(_, v) => setSelectedCountry(v || '')}
            renderInput={(p) => <TextField {...p} label="Country" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              label="Sort By"
              value={sortOrder}
              onChange={(e: SelectChangeEvent) =>
                setSortOrder(e.target.value as SortOpt)
              }
            >
              <MenuItem value="nameAsc">Name Ascending</MenuItem>
              <MenuItem value="nameDesc">Name Descending</MenuItem>
              <MenuItem value="ageAsc">Age Ascending</MenuItem>
              <MenuItem value="ageDesc">Age Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {filteredEmployees.map((e) => (
            <Grid item xs={12} sm={6} md={4} key={e._id}>
              <EmployeeCard employee={e} onClick={() => openDialog(e)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <EmployeeProfileDialog
        open={dialogOpen}
        employee={activeEmp}
        onClose={closeDialog}
        onRate={handleRate}
      />
    </Box>
  );
};

export default Employees;
