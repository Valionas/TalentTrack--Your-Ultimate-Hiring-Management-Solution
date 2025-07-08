import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Button,
  Tooltip,
  IconButton,
  InputAdornment,
  Avatar,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  AuthResponse,
  RegisterData,
  useRegisterMutation,
} from '../../api/services/authService';
import { countries } from '../../constants/countries';

// ---------------------------------------------
// Validation‑error shape
// ---------------------------------------------
interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  country: string;
  password: string;
  repeatPassword: string;
  safeCode: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  // -------------------------------------------------
  // form fields
  // -------------------------------------------------
  const [avatar, setAvatar] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [country, setCountry] = useState<string>('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [safeCode, setSafeCode] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [showSafeCode, setShowSafeCode] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    country: '',
    password: '',
    repeatPassword: '',
    safeCode: '',
  });

  // -------------------------------------------------
  // register mutation
  // -------------------------------------------------
  const { mutate: register, isLoading } = useRegisterMutation({
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      if (data.id) localStorage.setItem('currentUser', data.id);
      toast.success('Registration successful!', { position: 'bottom-right' });
      navigate('/jobs');
    },
    onError: (error: any) => {
      toast.error(error.message, { position: 'bottom-right' });
    },
  });

  // -------------------------------------------------
  // Validation helpers
  // -------------------------------------------------
  const notifyError = (msg: string) =>
    toast.error(msg, { position: 'bottom-right' });

  const validateNameField = (value: string, label: string) =>
    value ? '' : `${label} is required`;

  const validateEmail = (v: string) => {
    if (!v) return 'Email is required';
    const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return rx.test(v) ? '' : 'Invalid email address';
  };

  const validateAge = (v: number | '') => {
    if (v === '' || v === undefined) return 'Age is required';
    return v > 0 ? '' : 'Age must be a positive number';
  };

  const validateCountry = (v: string) => (!v ? 'Country is required' : '');

  const validatePassword = (v: string) =>
    !v ? 'Password is required'
      : v.length >= 8
        ? ''
        : 'Password must be at least 8 characters';

  const validateRepeatPassword = (v: string) =>
    !v ? 'Please repeat your password'
      : v === password
        ? ''
        : 'Passwords do not match';

  // six‑digit numeric safe code
  const validateSafeCode = (v: string) => {
    if (!v) return 'Safe code is required';
    const rx = /^\d{6}$/;
    return rx.test(v) ? '' : 'Safe code must be 6 digits';
  };

  // -------------------------------------------------
  // Avatar upload helper
  // -------------------------------------------------
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64Image = await convertToBase64(file);
      setAvatar(base64Image);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // -------------------------------------------------
  // Submit handler
  // -------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const firstNameErr = validateNameField(firstName, 'First name');
    const lastNameErr = validateNameField(lastName, 'Last name');
    const emailErr = validateEmail(email);
    const ageErr = validateAge(age);
    const countryErr = validateCountry(country);
    const passwordErr = validatePassword(password);
    const repeatPasswordErr = validateRepeatPassword(repeatPassword);
    const safeCodeErr = validateSafeCode(safeCode);

    if (
      firstNameErr ||
      lastNameErr ||
      emailErr ||
      ageErr ||
      countryErr ||
      passwordErr ||
      repeatPasswordErr ||
      safeCodeErr
    ) {
      setErrors({
        firstName: firstNameErr,
        lastName: lastNameErr,
        email: emailErr,
        age: ageErr,
        country: countryErr,
        password: passwordErr,
        repeatPassword: repeatPasswordErr,
        safeCode: safeCodeErr,
      });

      [
        firstNameErr,
        lastNameErr,
        emailErr,
        ageErr,
        countryErr,
        passwordErr,
        repeatPasswordErr,
        safeCodeErr,
      ].filter(Boolean).forEach(notifyError);

      return;
    }

    const payload: RegisterData = {
      firstName,
      lastName,
      email,
      age: Number(age),
      country,
      avatar,
      password,
      safeCode,
    } as RegisterData;

    register(payload);
  };

  // -------------------------------------------------
  // UI
  // -------------------------------------------------
  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography component="h1" variant="h4" gutterBottom>
            Register
          </Typography>

          {/* ---------- Avatar block (below heading) ---------- */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              src={avatar || 'https://via.placeholder.com/150'}
              sx={{ width: 120, height: 120 }}
            />
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 1 }}
            >
              Upload Avatar
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              {/* Age */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  error={!!errors.age}
                  helperText={errors.age}
                />
              </Grid>

              {/* Country */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  options={countries}
                  value={country}
                  onChange={(_, newValue) => setCountry(newValue || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      required
                      error={!!errors.country}
                      helperText={errors.country}
                    />
                  )}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((show) => !show)}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Repeat Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="repeatPassword"
                  label="Repeat Password"
                  type={showRepeatPassword ? "text" : "password"}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  error={!!errors.repeatPassword}
                  helperText={errors.repeatPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle repeat password visibility"
                          onClick={() => setShowRepeatPassword((show) => !show)}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Safe Code */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type={showSafeCode ? "text" : "password"}
                  id="safeCode"
                  label="Safe Code"
                  value={safeCode}
                  onChange={(e) => setSafeCode(e.target.value)}
                  error={!!errors.safeCode}
                  helperText={errors.safeCode}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Create a back‑up 6‑digit code in case you need to reset your password.">
                          <IconButton edge="end" tabIndex={-1}>
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          aria-label="toggle safe code visibility"
                          onClick={() => setShowSafeCode((show) => !show)}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showSafeCode ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering…' : 'Register'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
