// src/pages/MessageViewDialog.tsx

import React, { useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Avatar,
    TextField,
    Button,
    Box,
    useTheme,
    useMediaQuery,
    Skeleton,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Message as IMessage } from '../../packages/models/Message';
import { useAllUsersQuery } from '../../api/services/userService';

interface Props {
    open: boolean;
    message: IMessage | null;
    onClose: () => void;
}

const MessageViewDialog: React.FC<Props> = ({ open, message, onClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: users } = useAllUsersQuery();

    const {
        fromEmail,
        fromAvatar,
        toEmail,
        toAvatar,
        topic,
        description,
    } = useMemo(() => {
        let fromEmail = '';
        let toEmail = '';
        let fromAvatar = '';
        let toAvatar = '';
        let topic = '';
        let description = '';

        if (message) {
            fromEmail = message.senderEmail || message.sender;
            toEmail = message.receiverEmail || message.receiver;
            topic = message.topic || '';
            description = message.description;

            if (users) {
                const uFrom = users.find(
                    (u) =>
                        u._id === message.sender || u.email === message.senderEmail
                );
                const uTo = users.find(
                    (u) =>
                        u._id === message.receiver ||
                        u.email === message.receiverEmail
                );
                if (uFrom) {
                    fromAvatar = uFrom.avatar || '';
                    fromEmail = uFrom.email;
                }
                if (uTo) {
                    toAvatar = uTo.avatar || '';
                    toEmail = uTo.email;
                }
            }
        }

        return { fromEmail, fromAvatar, toEmail, toAvatar, topic, description };
    }, [users, message]);

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailOutlinedIcon /> Message Details
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    {/* From */}
                    <Grid item xs={12} sm={6}>
                        <Box textAlign="center">
                            {users ? (
                                <Avatar
                                    src={fromAvatar}
                                    sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                                />
                            ) : (
                                <Skeleton
                                    variant="circular"
                                    width={80}
                                    height={80}
                                    sx={{ mx: 'auto', mb: 1 }}
                                />
                            )}
                        </Box>
                        <TextField
                            label="From"
                            value={fromEmail}
                            fullWidth
                            variant="filled"
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{
                                backgroundColor: theme.palette.action.hover,
                                mb: 2,
                            }}
                        />
                    </Grid>

                    {/* To */}
                    <Grid item xs={12} sm={6}>
                        <Box textAlign="center">
                            {users ? (
                                <Avatar
                                    src={toAvatar}
                                    sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                                />
                            ) : (
                                <Skeleton
                                    variant="circular"
                                    width={80}
                                    height={80}
                                    sx={{ mx: 'auto', mb: 1 }}
                                />
                            )}
                        </Box>
                        <TextField
                            label="To"
                            value={toEmail}
                            fullWidth
                            variant="filled"
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{
                                backgroundColor: theme.palette.action.hover,
                                mb: 2,
                            }}
                        />
                    </Grid>

                    {/* Topic */}
                    <Grid item xs={12}>
                        <TextField
                            label="Topic"
                            value={topic}
                            fullWidth
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    {/* Message */}
                    <Grid item xs={12}>
                        <TextField
                            label="Message"
                            value={description}
                            fullWidth
                            multiline
                            rows={6}
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MessageViewDialog;
