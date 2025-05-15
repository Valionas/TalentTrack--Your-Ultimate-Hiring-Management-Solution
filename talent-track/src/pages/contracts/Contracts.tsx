// src/pages/Contracts.tsx

import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TableSortLabel,
  Avatar,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { toast } from 'react-toastify';
import {
  useContractsQuery,
  useDeleteContractMutation,
  useUpdateContractMutation as useUpdateContractStatusMutation,
  useSoftDeleteForCurrentUser,
} from '../../api/services/contractService';
import {
  useJobsQuery,
  useUpdateJobMutation,
} from '../../api/services/jobService';
import { useAllUsersQuery } from '../../api/services/userService';
import { Contract, ContractStatus } from '../../packages/models/Contract';
import { JobResponse } from '../../packages/models/Job';
import { UserProfileResponse } from '../../packages/models/UserProfile';
import EmployeeProfileDialog from '../employees/EmployeeProfileDialog';
import ConfirmAcceptDialog from './ConfirmAcceptDialog';
import ConfirmCancelDialog from './ConfirmCancelDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

type SortKey =
  | 'jobName'
  | 'contactEmail'
  | 'candidateName'
  | 'country'
  | 'age'
  | 'status';

interface ContractRow extends Contract {
  user: UserProfileResponse | null;
}

const columns: { key: SortKey; label: string }[] = [
  { key: 'jobName', label: 'Job' },
  { key: 'contactEmail', label: 'Email' },
  { key: 'candidateName', label: 'Candidate' },
  { key: 'country', label: 'Country' },
  { key: 'age', label: 'Age' },
  { key: 'status', label: 'Status' },
];

const Contracts: React.FC = () => {
  const currentUser = localStorage.getItem('currentUser') || '';

  // Fetch data
  const {
    data: contracts,
    isLoading: cLoading,
    isError: cError,
    refetch: refetchContracts,
  } = useContractsQuery();
  const { data: users, isLoading: uLoading, isError: uError } = useAllUsersQuery();
  const {
    data: jobs,
    isLoading: jLoading,
    isError: jError,
    refetch: refetchJobs,
  } = useJobsQuery();

  // Mutations
  const { mutate: hardDeleteContract } = useDeleteContractMutation({
    onSuccess: () => {
      toast.success('Contract cancelled');
      refetchContracts();
    },
  });
  const { mutate: softDeleteForMe } = useSoftDeleteForCurrentUser({
    onSuccess: () => {
      toast.info('Contract hidden from your view');
      refetchContracts();
    },
  });
  const { mutate: updateContractStatus } = useUpdateContractStatusMutation({
    onSuccess: () => {
      toast.success('Contract accepted');
      refetchContracts();
    },
  });
  const { mutate: updateJob } = useUpdateJobMutation({
    onSuccess: () => refetchJobs(),
  });

  // Lookup owned jobs
  const myJobsById = useMemo<Record<string, JobResponse>>(() => {
    if (!jobs) return {};
    return jobs
      .filter(j => j.createdBy === currentUser)
      .reduce((acc, j) => {
        acc[j._id] = j;
        return acc;
      }, {} as Record<string, JobResponse>);
  }, [jobs, currentUser]);

  // Build and filter rows
  const rows: ContractRow[] = useMemo(() => {
    if (!contracts || !users || !jobs) return [];
    return contracts
      .filter(ct => myJobsById[ct.jobId] || ct.userId === currentUser)
      .map(ct => ({
        ...ct,
        jobName: myJobsById[ct.jobId]?.title ?? ct.jobName,
        user: users.find(u => u._id === ct.userId) ?? null,
      }));
  }, [contracts, users, jobs, myJobsById, currentUser]);

  // Sorting
  const [orderBy, setOrderBy] = useState<SortKey>('status');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const handleSort = (key: SortKey) => {
    const isAsc = orderBy === key && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(key);
  };
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      switch (orderBy) {
        case 'candidateName':
          aVal = a.user ? `${a.user.firstName} ${a.user.lastName}`.toLowerCase() : '';
          bVal = b.user ? `${b.user.firstName} ${b.user.lastName}`.toLowerCase() : '';
          break;
        case 'country':
          aVal = a.user?.country?.toLowerCase() || '';
          bVal = b.user?.country?.toLowerCase() || '';
          break;
        case 'age':
          aVal = a.user?.age || 0;
          bVal = b.user?.age || 0;
          break;
        default:
          aVal = String((a as any)[orderBy] ?? '').toLowerCase();
          bVal = String((b as any)[orderBy] ?? '').toLowerCase();
      }
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, orderBy, order]);

  // Dialog state
  const [selectedUser, setSelectedUser] = useState<UserProfileResponse | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmAcceptOpen, setConfirmAcceptOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<ContractRow | null>(null);

  const onAcceptClick = (row: ContractRow) => {
    setActiveRow(row);
    setConfirmAcceptOpen(true);
  };
  const onCancelClick = (row: ContractRow) => {
    setActiveRow(row);
    setConfirmCancelOpen(true);
  };
  const onDeleteClick = (row: ContractRow) => {
    setActiveRow(row);
    setConfirmDeleteOpen(true);
  };

  // Loading / Error
  if (cLoading || uLoading || jLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }
  if (cError || uError || jError) {
    return <Typography color="error">Failed to load data</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {columns.map(col => (
                <TableCell key={col.key}>
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={orderBy === col.key ? order : 'asc'}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  <Typography>No contracts to display.</Typography>
                </TableCell>
              </TableRow>
            )}
            {sorted.map(row => {
              const isOwner = Boolean(myJobsById[row.jobId]);
              const isApplicant = row.userId === currentUser;
              const displayStatus =
                isOwner && row.status === 'Applied' ? 'Pending' : row.status;

              const showAccept = isOwner && displayStatus === 'Pending';
              const showCancel =
                (isOwner || isApplicant) &&
                ['Applied', 'Pending'].includes(displayStatus);
              const showTrash =
                ['Approved', 'Rejected'].includes(displayStatus);

              return (
                <TableRow key={row._id} hover>
                  <TableCell>
                    <Avatar
                      src={row.user?.avatar || undefined}
                      sx={{ cursor: row.user ? 'pointer' : undefined }}
                      onClick={() => {
                        if (row.user) {
                          setSelectedUser(row.user);
                          setProfileOpen(true);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.jobName}</TableCell>
                  <TableCell>{row.contactEmail}</TableCell>
                  <TableCell>
                    {row.user
                      ? `${row.user.firstName} ${row.user.lastName}`
                      : '—'}
                  </TableCell>
                  <TableCell>{row.user?.country || '—'}</TableCell>
                  <TableCell>{row.user?.age ?? '—'}</TableCell>
                  <TableCell>{displayStatus}</TableCell>
                  <TableCell>
                    {showAccept && (
                      <Button size="small" onClick={() => onAcceptClick(row)}>
                        Accept
                      </Button>
                    )}
                    {showCancel && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onCancelClick(row)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    )}
                    {showTrash && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteClick(row)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm Accept */}
      {activeRow && (
        <ConfirmAcceptDialog
          open={confirmAcceptOpen}
          jobName={activeRow.jobName}
          candidateName={`${activeRow.user?.firstName} ${activeRow.user?.lastName}`}
          onClose={() => setConfirmAcceptOpen(false)}
          onConfirm={() => {
            updateContractStatus({
              id: activeRow._id!,
              data: { status: 'Approved' as ContractStatus },
            });
            setConfirmAcceptOpen(false);
          }}
        />
      )}

      {/* Confirm Cancel */}
      {activeRow && (
        <ConfirmCancelDialog
          open={confirmCancelOpen}
          jobName={activeRow.jobName}
          candidateName={`${activeRow.user?.firstName} ${activeRow.user?.lastName}`}
          onClose={() => setConfirmCancelOpen(false)}
          onConfirm={() => {
            // hard delete + remove from job applicants
            hardDeleteContract(activeRow._id!);
            const job = jobs!.find(j => j._id === activeRow.jobId);
            if (job) {
              const updatedApplicants = (job.applicants ?? []).filter(
                id => id !== activeRow.userId
              );
              updateJob({ id: job._id, data: { ...job, applicants: updatedApplicants } });
            }
            setConfirmCancelOpen(false);
          }}
        />
      )}

      {/* Confirm Delete (soft-delete) */}
      {activeRow && (
        <ConfirmDeleteDialog
          open={confirmDeleteOpen}
          jobName={activeRow.jobName}
          candidateName={`${activeRow.user?.firstName} ${activeRow.user?.lastName}`}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={() => {
            softDeleteForMe({ id: activeRow._id!, userId: currentUser });
            setConfirmDeleteOpen(false);
          }}
        />
      )}

      {/* Profile dialog */}
      <EmployeeProfileDialog
        open={profileOpen}
        employee={selectedUser}
        onClose={() => setProfileOpen(false)}
        onRate={(emp, val) => {
          console.log('Rated', emp, val);
          setProfileOpen(false);
        }}
      />
    </>
  );
};

export default Contracts;
