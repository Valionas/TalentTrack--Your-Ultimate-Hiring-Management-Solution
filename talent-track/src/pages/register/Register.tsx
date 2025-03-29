// components/Register.tsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  AuthResponse,
  RegisterData,
  useRegisterMutation,
} from '../../api/services/authService';

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  const { mutate: register, isLoading } = useRegisterMutation({
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('currentUser', data.id);
      toast.success('Registration successful!', {
        position: 'bottom-right',
      });
      navigate('/jobs');
    },
    onError: (error: any) => {
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

  const validateNameField = (name: string, fieldName: string): string => {
    if (!name) return `${fieldName} is required`;
    return '';
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();

    // Validate all fields
    const firstNameError = validateNameField(firstName, 'First name');
    const lastNameError = validateNameField(lastName, 'Last name');
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const repeatPasswordError = validateRepeatPassword(repeatPassword);

    if (firstNameError || lastNameError || emailError || passwordError || repeatPasswordError) {
      setErrors({
        firstName: firstNameError,
        lastName: lastNameError,
        email: emailError,
        password: passwordError,
        repeatPassword: repeatPasswordError,
      });
      if (firstNameError) notifyError(firstNameError);
      if (lastNameError) notifyError(lastNameError);
      if (emailError) notifyError(emailError);
      if (passwordError) notifyError(passwordError);
      if (repeatPasswordError) notifyError(repeatPasswordError);
      return;
    }

    // Submit form with all fields
    const registerData: RegisterData = { firstName, lastName, email, password };
    register(registerData);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 20 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setRepeatPassword(e.target.value)}
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

export default Register;
