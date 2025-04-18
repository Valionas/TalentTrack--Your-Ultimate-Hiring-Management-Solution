import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

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
        <DialogActions>
            <Button onClick={onCancel}>{cancelText}</Button>
            <Button color="error" onClick={onConfirm} variant="contained">
                {confirmText}
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;
