// src/pages/Messages.tsx

import React, { useState, useMemo } from 'react';
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    Typography,
    CircularProgress,
    IconButton,
    Chip,
    useTheme,
    useMediaQuery,
    Paper,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    EmailOutlined as EmailIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import {
    useMessagesByReceiverQuery,
    useSendMessageMutation,
    useDeleteMessageMutation,
} from '../../api/services/messageService';
import { useAllUsersQuery } from '../../api/services/userService';
import MessageViewDialog from './MessageViewDialog';
import MessageComposeDialog from './MessageComposeDialog';
import ConfirmDialog from './ConfirmDialog';
import { Message as IMessage } from '../../packages/models/Message';

const Messages: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const currentUserId = localStorage.getItem('currentUser') || '';

    // Fetch user’s incoming messages & all users for avatars
    const { data: messages, isLoading, refetch: refetchMessages } =
        useMessagesByReceiverQuery(currentUserId);
    const { data: users } = useAllUsersQuery();

    const sendMessage = useSendMessageMutation().mutate;
    const deleteMessage = useDeleteMessageMutation().mutate;

    // Local UI state
    const [composeOpen, setComposeOpen] = useState(false);
    const [viewMsg, setViewMsg] = useState<IMessage | null>(null);
    const [delId, setDelId] = useState<string | null>(null);

    // Build quick lookup for avatars
    const avatarMap = useMemo(() => {
        const m: Record<string, string> = {};
        users?.forEach(u => {
            m[u._id] = u.avatar || '';
            m[u.email] = u.avatar || '';
        });
        return m;
    }, [users]);

    const handleSend = (vals: {
        receiver: string;
        topic: string;
        description: string;
    }) => {
        sendMessage(
            {
                date: new Date().toISOString(),
                sender: currentUserId,
                receiver: vals.receiver,
                topic: vals.topic,
                description: vals.description,
            },
            { onSuccess: () => refetchMessages() }
        );
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setComposeOpen(true)}
                sx={{ mb: 4 }}
            >
                Compose Message
            </Button>

            <MessageComposeDialog
                open={composeOpen}
                onClose={() => setComposeOpen(false)}
                onSend={handleSend}
            />

            {messages && messages.length > 0 ? (
                <Paper>
                    <List disablePadding>
                        {messages.map(m => {
                            const from = m.senderEmail ?? m.sender;
                            const to = m.receiverEmail ?? m.receiver;
                            const date = new Date(m.date).toLocaleString();

                            return (
                                <ListItem
                                    key={m._id}
                                    divider
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                edge="end"
                                                aria-label="view"
                                                color="primary"
                                                onClick={() => setViewMsg({ ...m, sender: m.sender ?? '' })}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                color="error"
                                                onClick={() => setDelId(m._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                    sx={{ alignItems: 'flex-start' }}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={avatarMap[from] || undefined} />
                                    </ListItemAvatar>

                                    <Box sx={{ flex: 1, ml: 2 }}>
                                        {/* Row 1: from → to (date) */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: isMobile ? 'column' : 'row',
                                                alignItems: isMobile ? 'flex-start' : 'center',
                                                gap: 1,
                                                mb: 0.5,
                                            }}
                                        >
                                            <Chip
                                                icon={<EmailIcon />}
                                                label={from}
                                                size="small"
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ ml: isMobile ? 0 : 1, mr: 1 }}
                                            >
                                                →
                                            </Typography>
                                            <Chip
                                                icon={<EmailIcon />}
                                                label={to}
                                                size="small"
                                            />
                                            <Chip
                                                icon={<CalendarIcon />}
                                                label={date}
                                                size="small"
                                                sx={{ ml: isMobile ? 0 : 2 }}
                                            />
                                        </Box>

                                        {/* Row 2: topic */}
                                        {m.topic && (
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ fontWeight: 'bold', mb: 0.5 }}
                                            >
                                                {m.topic}
                                            </Typography>
                                        )}

                                        {/* Row 3: body */}
                                        <Typography variant="body2" color="text.primary">
                                            {m.description}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            ) : (
                <Typography>No new messages.</Typography>
            )}

            {/* View dialog */}
            <MessageViewDialog
                open={Boolean(viewMsg)}
                message={viewMsg}
                onClose={() => setViewMsg(null)}
            />

            {/* Delete confirmation */}
            <ConfirmDialog
                open={Boolean(delId)}
                title="Delete this message?"
                onCancel={() => setDelId(null)}
                onConfirm={() => {
                    if (!delId) return;
                    deleteMessage(
                        { id: delId, userId: currentUserId },
                        {
                            onSuccess: () => {
                                refetchMessages();
                                setDelId(null);
                            },
                        }
                    );
                }}
            />
        </Box>
    );
};

export default Messages;
