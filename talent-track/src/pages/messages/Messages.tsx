import React, { useState } from 'react';
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    CircularProgress,
} from '@mui/material';
import {
    useMessagesByReceiverQuery,
    useSendMessageMutation,
    useDeleteMessageMutation,
} from '../../api/services/messageService';
import MessageViewDialog from './MessageViewDialog';
import MessageComposeDialog from './MessageComposeDialog';
import ConfirmDialog from './ConfirmDialog';
import { Message as IMessage } from '../../packages/models/Message';


const Messages: React.FC = () => {
    // localStorage.currentUser now holds the user’s ID
    const currentUserId = localStorage.getItem('currentUser') || '';

    const { data: messages, isLoading, refetch } =
        useMessagesByReceiverQuery(currentUserId);

    const { mutate: sendMessage } = useSendMessageMutation();
    const { mutate: deleteMessage } = useDeleteMessageMutation();

    const [composeOpen, setComposeOpen] = useState(false);
    const [viewMsg, setViewMsg] = useState<IMessage | null>(null);
    const [delId, setDelId] = useState<string | null>(null);

    /* send a new message */
    const handleSend = (vals: {
        receiver: string;
        topic: string;
        description: string;
    }) => {
        const payload: IMessage = {
            date: new Date().toISOString(),
            sender: currentUserId,      // sending own ID
            receiver: vals.receiver,
            topic: vals.topic,
            description: vals.description,
        };
        sendMessage(payload, { onSuccess: () => refetch() });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Button
                variant="contained"
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

            {messages && messages.length ? (
                <List>
                    {messages.map((m) => (
                        <ListItem key={m._id} divider>
                            <ListItemText
                                primary={`${m.senderEmail ?? m.sender ?? '??'} → ${m.receiverEmail ?? m.receiver ?? '??'
                                    } (${new Date(m.date).toLocaleString()})`}
                                secondary={
                                    <>
                                        {m.topic && <strong>Topic: {m.topic} · </strong>}
                                        {m.description}
                                    </>
                                }
                            />

                            <Button
                                sx={{ mr: 1 }}
                                onClick={() => setViewMsg(m as unknown as IMessage)}
                            >
                                View
                            </Button>

                            <Button color="error" onClick={() => setDelId(m._id)}>
                                Delete
                            </Button>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No new messages.</Typography>
            )}

            {/* Read‑only view dialog */}
            <MessageViewDialog
                open={Boolean(viewMsg)}
                message={viewMsg}
                onClose={() => setViewMsg(null)}
            />

            {/* Confirm before delete */}
            <ConfirmDialog
                open={Boolean(delId)}
                title="Delete this message?"
                onCancel={() => setDelId(null)}
                onConfirm={() => {
                    if (delId) {
                        deleteMessage(
                            { id: delId, userId: currentUserId },
                            {
                                onSuccess: () => {
                                    refetch();
                                    setDelId(null);
                                },
                            }
                        );
                    }
                }}
            />
        </Box>
    );
};

export default Messages;
