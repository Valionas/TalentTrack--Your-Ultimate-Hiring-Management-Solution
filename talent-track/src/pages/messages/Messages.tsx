// src/pages/Messages.tsx

import React, { useState, useMemo } from 'react';
import {
    Box,
    Button,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemSecondaryAction,
    Typography,
    CircularProgress,
    IconButton,
    Chip,
    Paper,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    EmailOutlined as EmailIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import {
    useMessagesQuery,
    useSendMessageMutation,
    useUpdateMessageMutation,
} from '../../api/services/messageService';
import { toast } from 'react-toastify';
import { useAllUsersQuery } from '../../api/services/userService';
import MessageViewDialog from './MessageViewDialog';
import MessageComposeDialog from './MessageComposeDialog';
import ConfirmDialog from './ConfirmDialog';
import { MessageResponse } from '../../packages/models/Message';

const TRUNCATE_LENGTH = 100;

const Messages: React.FC = () => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const currentUserId = localStorage.getItem('currentUser') || '';

    // Fetch all messages & users
    const { data: allMessages = [], isLoading, refetch } = useMessagesQuery();
    const { data: users } = useAllUsersQuery();

    // Mutations
    const sendMessage = useSendMessageMutation().mutate;
    const { mutate: updateMessage } = useUpdateMessageMutation({
        onSuccess: () => {
            toast.info('Message hidden from your view');
            refetch();
        },
    });

    // Split into received & sent and exclude hidden
    const received = useMemo(
        () =>
            allMessages.filter(
                m =>
                    m.receiverId === currentUserId &&
                    !(m.deletedFor || []).includes(currentUserId)
            ),
        [allMessages, currentUserId]
    );
    const sent = useMemo(
        () =>
            allMessages.filter(
                m =>
                    m.senderId === currentUserId &&
                    !(m.deletedFor || []).includes(currentUserId)
            ),
        [allMessages, currentUserId]
    );

    // Avatar lookup
    const avatarMap = useMemo(() => {
        const m: Record<string, string> = {};
        users?.forEach(u => {
            m[u._id] = u.avatar || '';
            m[u.email!] = u.avatar || '';
        });
        return m;
    }, [users]);

    // UI state
    const [tab, setTab] = useState<'received' | 'sent'>('received');
    const [composeOpen, setComposeOpen] = useState(false);
    const [viewMsg, setViewMsg] = useState<MessageResponse | null>(null);
    const [delId, setDelId] = useState<string | null>(null);

    const activeList = tab === 'received' ? received : sent;
    const emptyText =
        tab === 'received' ? 'No received messages.' : 'No sent messages.';

    // Send handler
    const handleSend = (vals: {
        receiver: string;
        topic: string;
        description: string;
    }) => {
        sendMessage(
            {
                date: new Date().toISOString(),
                senderId: currentUserId,
                receiverId: vals.receiver,
                sender: currentUserId,
                receiver: vals.receiver,
                topic: vals.topic,
                description: vals.description,
            },
            {
                onSuccess: () => {
                    toast.success('Message sent successfully!');
                    refetch();
                    setComposeOpen(false);
                },
            }
        );
    };

    // Soft-hide handler
    const handleHide = (msg: MessageResponse) => {
        const newDeletedFor = Array.from(
            new Set([...(msg.deletedFor || []), currentUserId])
        );
        updateMessage({ id: msg._id, data: { deletedFor: newDeletedFor } });
        setDelId(null);
    };

    // Sort messages by date descending
    const sortedReceived = [...received].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const sortedSent = [...sent].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ mb: 2 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant={isXs ? 'fullWidth' : 'standard'}
                >
                    <Tab label="Received" value="received" />
                    <Tab label="Sent" value="sent" />
                </Tabs>
            </Paper>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setComposeOpen(true)}
                sx={{ mb: 2 }}
            >
                Compose Message
            </Button>

            <MessageComposeDialog
                open={composeOpen}
                onClose={() => setComposeOpen(false)}
                onSend={handleSend}
            />

            {activeList.length > 0 ? (
                <Paper>
                    <List disablePadding>
                        {tab === 'received'
                            ? sortedReceived.map(m => {
                                const from = m.senderEmail || m.senderId!;
                                const to = m.receiverEmail || m.receiverId!;
                                const date = new Date(m.date).toLocaleString();
                                const isLong = m.description.length > TRUNCATE_LENGTH;
                                const preview = isLong
                                    ? m.description.slice(0, TRUNCATE_LENGTH) + '…'
                                    : m.description;

                                return (
                                    <ListItem
                                        key={m._id}
                                        divider
                                        sx={{
                                            alignItems: 'flex-start',
                                            flexDirection: 'column',
                                            py: 2,
                                            px: isXs ? 1 : 3,
                                        }}
                                    >
                                        {/* Header: avatar + chips */}
                                        {isXs ? (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    mb: 2,
                                                }}
                                            >
                                                <Avatar
                                                    src={avatarMap[from] || undefined}
                                                    sx={{ width: 48, height: 48, mx: 'auto', mb: 1 }}
                                                />
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Chip icon={<EmailIcon />} label={from} size="small" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        →
                                                    </Typography>
                                                    <Chip icon={<EmailIcon />} label={to} size="small" />
                                                    <Chip
                                                        icon={<CalendarIcon />}
                                                        label={date}
                                                        size="small"
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex', mb: 2 }}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={avatarMap[from] || undefined}
                                                        sx={{ width: 64, height: 64, mr: 2 }}
                                                    />
                                                </ListItemAvatar>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Chip icon={<EmailIcon />} label={from} size="small" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        →
                                                    </Typography>
                                                    <Chip icon={<EmailIcon />} label={to} size="small" />
                                                    <Chip
                                                        icon={<CalendarIcon />}
                                                        label={date}
                                                        size="small"
                                                        sx={{ ml: 2 }}
                                                    />
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Subject & truncated body */}
                                        <Box sx={{ width: '100%', px: isXs ? 1 : 0 }}>
                                            {m.topic && (
                                                <Typography
                                                    variant={isXs ? 'subtitle2' : 'h6'}
                                                    sx={{ fontWeight: 'bold', mb: 1 }}
                                                >
                                                    {m.topic}
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="body2"
                                                color="text.primary"
                                                sx={{ whiteSpace: 'pre-wrap' }}
                                            >
                                                {preview}
                                            </Typography>
                                        </Box>

                                        {/* Actions */}
                                        {!isXs ? (
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="view"
                                                    color="primary"
                                                    onClick={() => setViewMsg(m)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="hide"
                                                    color="error"
                                                    onClick={() => setDelId(m._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        ) : (
                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: 2,
                                                }}
                                            >
                                                <IconButton
                                                    aria-label="view"
                                                    color="primary"
                                                    onClick={() => setViewMsg(m)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="hide"
                                                    color="error"
                                                    onClick={() => setDelId(m._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </ListItem>
                                );
                            })
                            : sortedSent.map(m => {
                                const from = m.senderEmail || m.senderId!;
                                const to = m.receiverEmail || m.receiverId!;
                                const date = new Date(m.date).toLocaleString();
                                const isLong = m.description.length > TRUNCATE_LENGTH;
                                const preview = isLong
                                    ? m.description.slice(0, TRUNCATE_LENGTH) + '…'
                                    : m.description;

                                return (
                                    <ListItem
                                        key={m._id}
                                        divider
                                        sx={{
                                            alignItems: 'flex-start',
                                            flexDirection: 'column',
                                            py: 2,
                                            px: isXs ? 1 : 3,
                                        }}
                                    >
                                        {/* Header: avatar + chips */}
                                        {isXs ? (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    mb: 2,
                                                }}
                                            >
                                                <Avatar
                                                    src={avatarMap[from] || undefined}
                                                    sx={{ width: 48, height: 48, mx: 'auto', mb: 1 }}
                                                />
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Chip icon={<EmailIcon />} label={from} size="small" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        →
                                                    </Typography>
                                                    <Chip icon={<EmailIcon />} label={to} size="small" />
                                                    <Chip
                                                        icon={<CalendarIcon />}
                                                        label={date}
                                                        size="small"
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex', mb: 2 }}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={avatarMap[from] || undefined}
                                                        sx={{ width: 64, height: 64, mr: 2 }}
                                                    />
                                                </ListItemAvatar>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Chip icon={<EmailIcon />} label={from} size="small" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        →
                                                    </Typography>
                                                    <Chip icon={<EmailIcon />} label={to} size="small" />
                                                    <Chip
                                                        icon={<CalendarIcon />}
                                                        label={date}
                                                        size="small"
                                                        sx={{ ml: 2 }}
                                                    />
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Subject & truncated body */}
                                        <Box sx={{ width: '100%', px: isXs ? 1 : 0 }}>
                                            {m.topic && (
                                                <Typography
                                                    variant={isXs ? 'subtitle2' : 'h6'}
                                                    sx={{ fontWeight: 'bold', mb: 1 }}
                                                >
                                                    {m.topic}
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="body2"
                                                color="text.primary"
                                                sx={{ whiteSpace: 'pre-wrap' }}
                                            >
                                                {preview}
                                            </Typography>
                                        </Box>

                                        {/* Actions */}
                                        {!isXs ? (
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="view"
                                                    color="primary"
                                                    onClick={() => setViewMsg(m)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="hide"
                                                    color="error"
                                                    onClick={() => setDelId(m._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        ) : (
                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: 2,
                                                }}
                                            >
                                                <IconButton
                                                    aria-label="view"
                                                    color="primary"
                                                    onClick={() => setViewMsg(m)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="hide"
                                                    color="error"
                                                    onClick={() => setDelId(m._id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </ListItem>
                                );
                            })}
                    </List>
                </Paper>
            ) : (
                <Typography>{emptyText}</Typography>
            )}

            <MessageViewDialog
                open={Boolean(viewMsg)}
                message={viewMsg}
                onClose={() => setViewMsg(null)}
            />

            <ConfirmDialog
                open={Boolean(delId)}
                title="Delete message?"
                onCancel={() => setDelId(null)}
                onConfirm={() => {
                    const msg = activeList.find(x => x._id === delId);
                    if (msg) handleHide(msg);
                }}
            />
        </Box>
    );
};

export default Messages;
