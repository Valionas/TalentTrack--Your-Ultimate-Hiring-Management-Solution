// src/components/EmployeeProfileDialog.tsx

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
import { calculateAverageRating } from './utils';

interface Props {
    open: boolean;
    employee: UserProfileResponse | null;
    onClose: () => void;
    onRate: (emp: UserProfileResponse, value: number) => void;
}

const EmployeeProfileDialog: React.FC<Props> = ({
    open,
    employee,
    onClose,
    onRate,
}) => {
    const [tempRating, setTempRating] = useState<number | null>(null);
    const [msgOpen, setMsgOpen] = useState(false);
    const sendMessageMutation = useSendMessageMutation();

    if (!employee) return null;

    // currentUser is the logged-in user's ID
    const currentUser = localStorage.getItem('currentUser') || '';
    const isSelf = employee._id === currentUser;

    const hasSkills = Array.isArray(employee.skills) && employee.skills.length > 0;
    const hasExperience =
        Array.isArray(employee.workExperience) && employee.workExperience.length > 0;

    // Dynamic column widths
    // - Only bio: full width
    // - Bio + one extra: split 6/6
    // - Bio + two extras: split 4/4/4
    const bioWidth = !hasSkills && !hasExperience
        ? 12
        : hasSkills && hasExperience
            ? 4
            : 6;
    const extraWidth = hasSkills && hasExperience ? 4 : 6;

    const handleSend = (vals: {
        receiver: string;
        topic: string;
        description: string;
    }) => {
        const payload: IMessage = {
            date: new Date().toISOString(),
            sender: currentUser,
            receiver: vals.receiver,
            topic: vals.topic,
            description: vals.description,
        };
        sendMessageMutation.mutate(payload, {
            onSuccess: () => {
                toast.success('Message sent');
                setMsgOpen(false);
            },
        });
    };

    return (
        <>
            <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
                <DialogTitle>
                    {employee.firstName} {employee.lastName}
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {/* Column 1: Bio */}
                        <Grid item xs={12} sm={bioWidth}>
                            <Box textAlign="center">
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
                                        value={tempRating ?? (calculateAverageRating(employee.ratings) ?? 0)}
                                        precision={0.5}
                                        onChange={(_, v) => setTempRating(v)}
                                        readOnly={isSelf}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        {/* Column 2: Skills */}
                        {hasSkills && (
                            <Grid item xs={12} sm={extraWidth}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Skills
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {employee.skills!.map((s) => (
                                        <Chip key={s} label={s} size="small" />
                                    ))}
                                </Box>
                            </Grid>
                        )}

                        {/* Column 3: Work Experience */}
                        {hasExperience && (
                            <Grid item xs={12} sm={extraWidth}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Work Experience
                                </Typography>
                                <Box sx={{ maxHeight: 220, overflowY: 'auto', pr: 1 }}>
                                    {employee.workExperience!.map((wx, i) => (
                                        <Box key={i} sx={{ mb: 2 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {wx.name} – {wx.company}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {wx.from} – {wx.to}
                                            </Typography>
                                            <Typography variant="body2">
                                                {wx.description}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>

                <DialogActions>
                    {/* Hide Message button if viewing your own profile */}
                    {!isSelf && (
                        <Button variant="outlined" onClick={() => setMsgOpen(true)}>
                            Message
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={() => {
                            // only call onRate if user actually picked a rating
                            if (tempRating != null) {
                                onRate(employee, tempRating);
                            }
                            onClose();
                        }}
                    >
                        {tempRating != null ? 'Submit Rating' : 'Close'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Message compose dialog */}
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
