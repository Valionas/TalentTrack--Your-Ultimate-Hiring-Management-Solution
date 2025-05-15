// src/pages/ConfirmDeleteDialog.tsx

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from '@mui/material';

interface ConfirmDeleteDialogProps {
    open: boolean;
    jobName: string;
    candidateName: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
    open,
    jobName,
    candidateName,
    onClose,
    onConfirm,
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete Contract?</DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure you want to delete the contract for “{jobName}” with {candidateName}?<br />
                This will hide it from your view.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button color="error" variant="contained" onClick={onConfirm}>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDeleteDialog;
