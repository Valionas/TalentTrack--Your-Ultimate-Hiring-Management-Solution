import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Avatar,
    Typography,
    Button,
    Box,
    Rating,
    Chip,
} from '@mui/material';
import { UserProfileResponse } from '../../packages/models/UserProfile';
import { Message as IMessage } from '../../packages/models/Message';
import { useSendMessageMutation } from '../../api/services/messageService';
import MessageComposeDialog from '../messages/MessageComposeDialog';
import { toast } from 'react-toastify';

interface Props {
    open: boolean;
    employee: UserProfileResponse | null;
    onClose: () => void;
    onRate: (emp: UserProfileResponse, value: number | null) => void;
}

const EmployeeProfileDialog: React.FC<Props> = ({
    open,
    employee,
    onClose,
    onRate,
}) => {
    const [tempRating, setTempRating] = useState<number | null>(null);
    const [msgOpen, setMsgOpen] = useState(false);

    /* ------ mutation hook for sending messages ------ */
    const { mutate: sendMessage } = useSendMessageMutation();

    const currentUserEmail = localStorage.getItem('currentUser') || '';

    /* handle message send from the compose dialog */
    const handleSend = (vals: { receiver: string; topic: string; description: string }) => {
        if (!employee) return;

        const payload: IMessage = {
            date: new Date().toISOString(),
            sender: currentUserEmail,
            receiver: vals.receiver,
            topic: vals.topic,
            description: vals.description,
        };

        sendMessage(payload, {
            onSuccess: () => {
                toast.success('Message sent');
                setMsgOpen(false);          // ✅ close dialog on success
            },
        });
    };

    if (!employee) return null;

    return (
        <>
            <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
                <DialogTitle>{employee.firstName} {employee.lastName}</DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {/* ----- Left column ----- */}
                        <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                            <Avatar
                                src={employee.avatar || 'https://via.placeholder.com/150'}
                                sx={{ width: 140, height: 140, mb: 2, mx: 'auto' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {employee.industry}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {employee.country} • Age {employee.age}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Rating
                                    value={tempRating ?? (employee.rating ?? 0)}
                                    precision={0.5}
                                    onChange={(_, v) => setTempRating(v)}
                                />
                            </Box>
                        </Grid>

                        {/* ----- Right column ----- */}
                        <Grid item xs={12} sm={8}>
                            {(employee?.skills ?? []).length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Skills
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {(employee.skills ?? []).map((s) => (
                                            <Chip key={s} label={s} size="small" />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {(employee.workExperience ?? []).length > 0 && (
                                <>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Work Experience
                                    </Typography>
                                    <Box sx={{ maxHeight: 220, overflowY: 'auto', pr: 1 }}>
                                        {(employee.workExperience ?? []).map((wx, i) => (
                                            <Box key={i} sx={{ mb: 1 }}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {wx.name} – {wx.company}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {wx.from} – {wx.to}
                                                </Typography>
                                                <Typography variant="body2">{wx.description}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={() => setMsgOpen(true)}>
                        Message
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            onRate(employee, tempRating);
                            onClose();
                        }}
                    >
                        {tempRating ? 'Submit Rating' : 'Close'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Message dialog with receiver pre‑filled */}
            <MessageComposeDialog
                open={msgOpen}
                defaultReceiver={employee.email}
                onClose={() => setMsgOpen(false)}
                onSend={handleSend}
            />
        </>
    );
};

export default EmployeeProfileDialog;
