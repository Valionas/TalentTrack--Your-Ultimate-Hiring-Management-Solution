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
  Chip,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import CakeIcon from '@mui/icons-material/Cake';
import InfoIcon from '@mui/icons-material/Info';
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

interface Column {
  key: SortKey;
  label: string;
  Icon: React.ElementType;
}

const columns: Column[] = [
  { key: 'jobName', label: 'Job', Icon: WorkIcon },
  { key: 'contactEmail', label: 'Email', Icon: EmailIcon },
  { key: 'candidateName', label: 'Candidate', Icon: PersonIcon },
  { key: 'country', label: 'Country', Icon: PublicIcon },
  { key: 'age', label: 'Age', Icon: CakeIcon },
  { key: 'status', label: 'Status', Icon: InfoIcon },
];

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'error'> = {
  Applied: 'primary',
  Pending: 'default',
  Approved: 'success',
  Rejected: 'error',
};

interface ContractRow extends Contract {
  user: UserProfileResponse | null;
}

const Contracts: React.FC = () => {
  const currentUser = localStorage.getItem('currentUser') || '';

  // Data fetching
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
    return jobs.reduce((acc, j) => {
      if (j.createdBy === currentUser) acc[j._id] = j;
      return acc;
    }, {} as Record<string, JobResponse>);
  }, [jobs, currentUser]);

  // Build & filter rows
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
    const asc = orderBy === key && order === 'asc';
    setOrder(asc ? 'desc' : 'asc');
    setOrderBy(key);
  };
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      switch (orderBy) {
        case 'candidateName':
          aVal = a.user
            ? `${a.user.firstName} ${a.user.lastName}`.toLowerCase()
            : '';
          bVal = b.user
            ? `${b.user.firstName} ${b.user.lastName}`.toLowerCase()
            : '';
          break;
        case 'country':
          aVal = a.user?.country?.toLowerCase() || '';
          bVal = b.user?.country?.toLowerCase() || '';
          break;
        case 'age':
          aVal = a.user?.age ?? 0;
          bVal = b.user?.age ?? 0;
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

  const onAccept = (r: ContractRow) => { setActiveRow(r); setConfirmAcceptOpen(true); };
  const onCancel = (r: ContractRow) => { setActiveRow(r); setConfirmCancelOpen(true); };
  const onDelete = (r: ContractRow) => { setActiveRow(r); setConfirmDeleteOpen(true); };

  // Loading / error
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <col.Icon fontSize="small" />
                      {col.label}
                    </Box>
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
                  No contracts to display.
                </TableCell>
              </TableRow>
            )}
            {sorted.map(r => {
              const isOwner = Boolean(myJobsById[r.jobId]);
              const isApplicant = r.userId === currentUser;
              const displayStatus = isOwner && r.status === 'Applied'
                ? 'Pending'
                : r.status;
              const showAccept = isOwner && displayStatus === 'Pending';
              const showCancel = (isOwner || isApplicant) && ['Applied', 'Pending'].includes(displayStatus);
              const showTrash = ['Approved', 'Rejected'].includes(displayStatus);

              return (
                <TableRow key={r._id} hover>
                  <TableCell>
                    <Avatar
                      src={r.user?.avatar || undefined}
                      sx={{ cursor: r.user ? 'pointer' : undefined }}
                      onClick={() =>
                        r.user && (setSelectedUser(r.user), setProfileOpen(true))
                      }
                    />
                  </TableCell>
                  <TableCell>{r.jobName}</TableCell>
                  <TableCell>{r.contactEmail}</TableCell>
                  <TableCell>
                    {r.user
                      ? `${r.user.firstName} ${r.user.lastName}`
                      : '—'}
                  </TableCell>
                  <TableCell>{r.user?.country || '—'}</TableCell>
                  <TableCell>{r.user?.age ?? '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={displayStatus}
                      color={statusColors[displayStatus] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {showAccept && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => onAccept(r)}
                      >
                        Accept
                      </Button>
                    )}
                    {showCancel && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => onCancel(r)}
                      >
                        Cancel
                      </Button>
                    )}
                    {showTrash && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(r)}
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
            hardDeleteContract(activeRow._id!);
            const job = jobs!.find(j => j._id === activeRow.jobId);
            if (job) {
              const updated = (job.applicants ?? []).filter(id => id !== activeRow.userId);
              updateJob({ id: job._id, data: { ...job, applicants: updated } });
            }
            setConfirmCancelOpen(false);
          }}
        />
      )}

      {/* Confirm Delete */}
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
