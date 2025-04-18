import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';

interface ComposeValues {
    receiver: string;
    topic: string;
    description: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSend: (values: ComposeValues) => void;
    defaultReceiver?: string; // pre‑fill & lock when provided
}

const MessageComposeDialog: React.FC<Props> = ({
    open,
    onClose,
    onSend,
    defaultReceiver = '',
}) => {
    const [values, setValues] = useState<ComposeValues>({
        receiver: defaultReceiver,
        topic: '',
        description: '',
    });

    /* reset when dialog re‑opens or defaultReceiver changes */
    useEffect(() => {
        if (open) {
            setValues({ receiver: defaultReceiver, topic: '', description: '' });
        }
    }, [open, defaultReceiver]);

    const handleInput =
        (field: keyof ComposeValues) =>
            (e: React.ChangeEvent<HTMLInputElement>) =>
                setValues({ ...values, [field]: e.target.value });

    const handleSend = () => {
        onSend(values);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Compose Message</DialogTitle>
            <DialogContent>
                <TextField
                    label="Receiver"
                    fullWidth
                    value={values.receiver}
                    onChange={handleInput('receiver')}
                    disabled={Boolean(defaultReceiver)}
                    sx={{ mt: 1 }}
                />
                <TextField
                    label="Topic"
                    fullWidth
                    value={values.topic}
                    onChange={handleInput('topic')}
                    sx={{ mt: 2 }}
                />
                <TextField
                    label="Message"
                    fullWidth
                    multiline
                    rows={4}
                    value={values.description}
                    onChange={handleInput('description')}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSend} variant="contained">
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MessageComposeDialog;
