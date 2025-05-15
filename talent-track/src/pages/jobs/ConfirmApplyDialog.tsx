import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

interface ConfirmApplyDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    jobTitle: string;
    companyName: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmApplyDialogProps> = ({
    open,
    onClose,
    onConfirm,
    jobTitle,
    companyName
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm application?</DialogTitle>
        <DialogContent>
            <Typography variant="body2">
                {`Are you sure you want to apply for “${jobTitle}” at ${companyName}?`}
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={onConfirm}>
                Apply
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDeleteDialog;
