// src/components/ConfirmCancelDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

interface Props {
    open: boolean;
    jobName: string;
    candidateName: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmCancelDialog: React.FC<Props> = ({
    open,
    jobName,
    candidateName,
    onClose,
    onConfirm,
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure you want to <strong>cancel</strong> the contract for <em>{candidateName}</em> on <em>{jobName}</em>?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>No</Button>
            <Button variant="contained" color="error" onClick={onConfirm}>
                Yes, Cancel
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmCancelDialog;
