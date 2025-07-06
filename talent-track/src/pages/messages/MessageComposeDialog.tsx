import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Avatar,
    Autocomplete,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useAllUsersQuery } from '../../api/services/userService';
import { UserProfileResponse } from '../../packages/models/UserProfile';
import { toast } from "react-toastify";

interface ComposeValues {
    receiver: string;       // this will be user._id
    topic: string;
    description: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSend: (values: ComposeValues) => void;
    defaultReceiver?: string; // an email address when called from EmployeeProfileDialog
}

const MessageComposeDialog: React.FC<Props> = ({
    open,
    onClose,
    onSend,
    defaultReceiver = '',
}) => {
    const { data: users, isLoading } = useAllUsersQuery();
    const [values, setValues] = useState<ComposeValues>({
        receiver: '',
        topic: '',
        description: '',
    });

    // NEW: Validation error state
    const [errors, setErrors] = useState<{ topic: string; description: string }>({
        topic: '',
        description: '',
    });

    const [selectedUser, setSelectedUser] = useState<UserProfileResponse | null>(null);

    // Whenever the dialog opens or defaultReceiver (email) changes, initialize:
    useEffect(() => {
        if (!open) return;
        // Reset text fields
        setValues({ receiver: '', topic: '', description: '' });
        setErrors({ topic: '', description: '' }); // clear errors
        if (defaultReceiver && users) {
            // Look up by email:
            const match = users.find(u => u.email === defaultReceiver);
            if (match) {
                setSelectedUser(match);
                setValues(v => ({ ...v, receiver: String(match._id) }));
            } else {
                setSelectedUser(null);
            }
        } else {
            setSelectedUser(null);
        }
    }, [open, defaultReceiver, users]);

    const validate = () => {
        const newErrors = { topic: '', description: '' };
        let hasError = false;

        if (!values.topic.trim()) {
            newErrors.topic = 'Topic is required';
            hasError = true;
        }
        if (!values.description.trim()) {
            newErrors.description = 'Message is required';
            hasError = true;
        }
        setErrors(newErrors);
        return !hasError;
    };

    const handleSend = () => {
        if (!validate()) return;
        onSend(values);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSend(values);
        onClose();
    };

    // For Autocomplete:
    const options = useMemo(() => users || [], [users]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Compose Message</DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" my={2}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Avatar preview */}
                        {selectedUser && (
                            <Box textAlign="center" mb={2}>
                                <Avatar
                                    src={selectedUser.avatar}
                                    sx={{ width: 80, height: 80, mx: 'auto' }}
                                />
                                <Typography variant="h6" mt={1}>
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </Typography>
                            </Box>
                        )}

                        <Autocomplete
                            options={options}
                            disabled={Boolean(defaultReceiver)}
                            getOptionLabel={u => `${u.firstName} ${u.lastName} (${u.email})`}
                            value={selectedUser}
                            onChange={(_, user) => {
                                if (user) {
                                    setSelectedUser(user);
                                    setValues(v => ({ ...v, receiver: String(user._id) }));
                                } else {
                                    setSelectedUser(null);
                                    setValues(v => ({ ...v, receiver: '' }));
                                }
                            }}
                            isOptionEqualToValue={(opt, val) => opt._id === val._id}
                            renderOption={(props, user) => (
                                <Box
                                    component="li"
                                    {...props}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                    <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                                    <Box>
                                        <Typography variant="body2">
                                            {user.firstName} {user.lastName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="Receiver"
                                    fullWidth
                                    sx={{ mt: 1 }}
                                />
                            )}
                        />

                        <TextField
                            label="Topic"
                            fullWidth
                            value={values.topic}
                            error={Boolean(errors.topic)}
                            helperText={errors.topic}
                            onChange={e => {
                                const val = e.target.value;
                                setValues(v => ({ ...v, topic: val }));
                                if (errors.topic && val.trim()) {
                                    setErrors(err => ({ ...err, topic: '' }));
                                }
                            }}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Message"
                            fullWidth
                            multiline
                            rows={4}
                            value={values.description}
                            error={Boolean(errors.description)}
                            helperText={errors.description}
                            onChange={e => {
                                const val = e.target.value;
                                setValues(v => ({ ...v, description: val }));
                                if (errors.description && val.trim()) {
                                    setErrors(err => ({ ...err, description: '' }));
                                }
                            }}
                            sx={{ mt: 2 }}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!values.receiver}
                >
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MessageComposeDialog;
