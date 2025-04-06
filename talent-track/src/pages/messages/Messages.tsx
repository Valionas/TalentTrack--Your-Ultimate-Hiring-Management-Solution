import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
    useMessagesByReceiverQuery,
    useSendMessageMutation,
    useUpdateMessageMutation,
    useDeleteMessageMutation,
} from '../../api/services/messageService';
import { Message as IMessage } from '../../packages/models/Message';

const Messages: React.FC = () => {
    // Retrieve the current user's email (receiver)
    const currentUserEmail = localStorage.getItem('currentUser') || '';
    // Fetch messages only for the current receiver
    const { data: messages, isLoading, refetch } = useMessagesByReceiverQuery(currentUserEmail);
    const { mutate: sendMessageMutation } = useSendMessageMutation();
    const { mutate: updateMessageMutation } = useUpdateMessageMutation();
    const { mutate: deleteMessageMutation } = useDeleteMessageMutation();

    // State to control dialog visibility
    const [openDialog, setOpenDialog] = useState(false);

    // Local state for composing a new message
    const [newMessage, setNewMessage] = useState<IMessage>({
        date: new Date().toISOString(),
        sender: '',
        receiver: '',
        description: '',
    });

    // Handle input changes for the new message form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage({
            ...newMessage,
            [e.target.name]: e.target.value,
        });
    };

    // Send a new message
    const handleSendMessage = () => {
        sendMessageMutation(newMessage, {
            onSuccess: () => {
                refetch();
                setNewMessage({
                    date: new Date().toISOString(),
                    sender: '',
                    receiver: '',
                    description: '',
                });
                setOpenDialog(false);
            },
        });
    };

    // Example update (you can expand this to show an edit form)
    const handleUpdateMessage = (id: string, updatedFields: Partial<IMessage>) => {
        updateMessageMutation({ id, data: { ...newMessage, ...updatedFields } }, {
            onSuccess: () => refetch(),
        });
    };

    // Delete a message
    const handleDeleteMessage = (id: string) => {
        deleteMessageMutation(id, {
            onSuccess: () => refetch(),
        });
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
            <Typography variant="h4" gutterBottom>
                Inbox for {currentUserEmail}
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                sx={{ mb: 4 }}
            >
                Compose Message
            </Button>

            {/* Dialog for composing a new message */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Compose New Message</DialogTitle>
                <DialogContent>
                    <TextField
                        name="sender"
                        label="Sender"
                        value={newMessage.sender}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="receiver"
                        label="Receiver"
                        value={newMessage.receiver}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="description"
                        label="Message"
                        value={newMessage.description}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSendMessage} variant="contained" color="primary">
                        Send Message
                    </Button>
                </DialogActions>
            </Dialog>

            {/* List of messages for the current receiver */}
            {messages && messages.length > 0 ? (
                <List>
                    {messages.map((message) => (
                        <ListItem key={message._id} divider>
                            <ListItemText
                                primary={`${message.sender} → ${message.receiver} (${new Date(
                                    message.date,
                                ).toLocaleString()})`}
                                secondary={message.description}
                            />
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleDeleteMessage(String(message._id))}
                            >
                                Delete
                            </Button>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1">No new messages.</Typography>
            )}
        </Box>
    );
};

export default Messages;
