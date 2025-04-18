import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Paper,
} from '@mui/material';
import { Message } from '../../packages/models/Message';

interface Props {
    open: boolean;
    message: Message | null;
    onClose: () => void;
}

const MessageViewDialog: React.FC<Props> = ({ open, message, onClose }) => {
    if (!message) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                📧 Message Details
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                From
                            </Typography>
                            <Typography>{message.senderEmail ?? message.sender}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                To
                            </Typography>
                            <Typography>{message.receiverEmail ?? message.receiver}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: 1.5 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Topic
                            </Typography>
                            <Typography fontWeight="bold">{message.topic}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: 1.5 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Message
                            </Typography>
                            <Typography whiteSpace="pre-line">{message.description}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MessageViewDialog;
