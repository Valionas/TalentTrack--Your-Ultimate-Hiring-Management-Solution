import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography, Button } from '@mui/material';

/**
 * Shown when:
 *  • the URL doesn’t match any route
 *  • an unauthenticated user tries to open a private route
 */
const NotFoundPage: React.FC = () => {
    const { pathname } = useLocation();

    return (
        <Box
            sx={{
                height: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                textAlign: 'center',
            }}
        >
            <Stack spacing={3} alignItems="center">
                <Typography variant="h1" fontWeight="bold">
                    404
                </Typography>

                <Typography variant="body1" maxWidth={400}>
                    Sorry, the page <code>{pathname}</code> doesn’t exist or you don’t have
                    permission to view it.
                </Typography>

                <Button
                    component={RouterLink}
                    to="/"
                    variant="outlined"
                    size="large"
                >
                    Back to Home
                </Button>
            </Stack>
        </Box>
    );
};

export default NotFoundPage;
