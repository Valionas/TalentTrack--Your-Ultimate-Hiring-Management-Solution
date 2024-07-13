import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  AuthResponse,
  RegisterData,
  useRegisterMutation,
} from '../../api/services/authService';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
    repeatPassword: '',
  });

  const { mutate: register, isLoading } = useRegisterMutation({
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      toast.success('Registration successful!', {
        position: 'bottom-right',
      });
      navigate('/jobs');
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'bottom-right',
      });
    },
  });

  const notifyError = (message: string) => {
    toast.error(message, {
      position: 'bottom-right',
    });
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Invalid email address';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    return password.length >= 8 ? '' : 'Password must be at least 8 characters';
  };

  const validateRepeatPassword = (repeatPassword: string): string => {
    if (!repeatPassword) return 'Please repeat your password';
    return repeatPassword === password ? '' : 'Passwords do not match';
  };

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = event.target.value;
    setEmail(value);
    setErrors((prevErrors) => ({ ...prevErrors, email: validateEmail(value) }));
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = event.target.value;
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: validatePassword(value),
    }));
  };

  const handleRepeatPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = event.target.value;
    setRepeatPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      repeatPassword: validateRepeatPassword(value),
    }));
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const repeatPasswordError = validateRepeatPassword(repeatPassword);

    if (emailError || passwordError || repeatPasswordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        repeatPassword: repeatPasswordError,
      });
      if (emailError) notifyError(emailError);
      if (passwordError) notifyError(passwordError);
      if (repeatPasswordError) notifyError(repeatPasswordError);
    } else {
      // Submit form
      const registerData: RegisterData = { email, password };
      register(registerData);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 20 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="repeatPassword"
              label="Repeat Password"
              type="password"
              id="repeatPassword"
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
              error={Boolean(errors.repeatPassword)}
              helperText={errors.repeatPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

interface FormErrors {
  email: string;
  password: string;
  repeatPassword: string;
}

export default Register;
