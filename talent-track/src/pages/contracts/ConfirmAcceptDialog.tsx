// src/components/ConfirmAcceptDialog.tsx
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

const ConfirmAcceptDialog: React.FC<Props> = ({
    open,
    jobName,
    candidateName,
    onClose,
    onConfirm,
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Acceptance</DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure you want to <strong>accept</strong> <em>{candidateName}</em> for <em>{jobName}</em>?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>No</Button>
            <Button variant="contained" onClick={onConfirm}>
                Yes, Accept
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmAcceptDialog;
