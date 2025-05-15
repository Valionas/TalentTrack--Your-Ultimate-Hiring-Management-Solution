import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

interface ConfirmDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    jobTitle: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
    open,
    onClose,
    onConfirm,
    jobTitle,
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm deletion?</DialogTitle>
        <DialogContent>
            <Typography variant="body2">
                Delete the job&nbsp;“{jobTitle}”? This action cannot be undone.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" color="error" onClick={onConfirm}>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDeleteDialog;
