import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button, DialogContent, Typography } from '@mui/material';

interface Props {
    open: boolean;
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog: React.FC<Props> = ({
    open,
    title,
    onCancel,
    onConfirm,
    confirmText = 'Delete',
    cancelText = 'Cancel',
}) => (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure you want to delete this message?
            </Typography>
            <Typography>
                This action cannot be undone.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>{cancelText}</Button>
            <Button color="error" onClick={onConfirm} variant="contained">
                {confirmText}
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;
