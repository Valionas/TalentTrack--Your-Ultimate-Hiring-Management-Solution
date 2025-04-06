// src/pages/Contracts.tsx
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TableSortLabel,
  Box,
  CircularProgress,
  Button,
  Typography,
} from '@mui/material';

import { useContractsQuery, useDeleteContractMutation } from '../../api/services/contractService';
import { Contract } from '../../packages/models/Contract';

const Contracts: React.FC = () => {
  const [orderBy, setOrderBy] = useState<keyof Contract>('status');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const {
    data: contracts,
    isLoading,
    isError,
    error,
    refetch,
  } = useContractsQuery();

  const { mutate: deleteContractMutation } = useDeleteContractMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      console.error('Failed to delete contract:', err);
    },
  });

  // Sort logic
  const handleRequestSort = (property: keyof Contract) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedContracts = useMemo(() => {
    if (!contracts) return [];
    return [...contracts].sort((a, b) => {
      let valA = String(a[orderBy] || '').toLowerCase();
      let valB = String(b[orderBy] || '').toLowerCase();
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [contracts, orderBy, order]);

  const handleDelete = (id: string) => {
    deleteContractMutation(id);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !contracts) {
    return (
      <Typography variant="h6" color="error">
        Failed to load contracts: {String(error)}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'jobName'}
                direction={orderBy === 'jobName' ? order : 'asc'}
                onClick={() => handleRequestSort('jobName')}
              >
                Job Name
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === 'contactEmail'}
                direction={orderBy === 'contactEmail' ? order : 'asc'}
                onClick={() => handleRequestSort('contactEmail')}
              >
                Contact Email
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === 'userId'}
                direction={orderBy === 'userId' ? order : 'asc'}
                onClick={() => handleRequestSort('userId')}
              >
                User ID
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === 'status'}
                direction={orderBy === 'status' ? order : 'asc'}
                onClick={() => handleRequestSort('status')}
              >
                Status
              </TableSortLabel>
            </TableCell>

            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedContracts.map((contract) => (
            <TableRow key={contract._id}>
              <TableCell>{contract.jobName}</TableCell>
              <TableCell>{contract.contactEmail}</TableCell>
              <TableCell>{contract.userId}</TableCell>
              <TableCell>{contract.status}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(contract._id!)}
                >
                  Delete
                </Button>
                {/* If you need an Update flow: <Button>Update</Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Contracts;
