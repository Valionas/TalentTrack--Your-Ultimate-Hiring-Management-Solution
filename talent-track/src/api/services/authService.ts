import { ErrorResponseModel } from '../../packages/models/Error';
import axiosClient from '../axiosClient';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

// Data interfaces
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  safeCode: string;
  age: number;
  country: string;
  avatar: string;   // base64 string
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
  safeCode: string;
  newPassword: string;
}

// Response interfaces
export interface AuthResponse {
  email: string;
  id: string;
  token: string;
}

// Register user mutation
export const useRegisterMutation = (
  options?: UseMutationOptions<AuthResponse, ErrorResponseModel, RegisterData>
): UseMutationResult<AuthResponse, ErrorResponseModel, RegisterData> =>
  useMutation<AuthResponse, ErrorResponseModel, RegisterData>(registerUser, options);

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user mutation
export const useLoginMutation = (
  options?: UseMutationOptions<AuthResponse, ErrorResponseModel, LoginData>
): UseMutationResult<AuthResponse, ErrorResponseModel, LoginData> =>
  useMutation<AuthResponse, ErrorResponseModel, LoginData>(loginUser, options);

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Reset password mutation
export const useResetPasswordMutation = (
  options?: UseMutationOptions<{ message: string }, ErrorResponseModel, ResetPasswordData>
): UseMutationResult<{ message: string }, ErrorResponseModel, ResetPasswordData> =>
  useMutation<{ message: string }, ErrorResponseModel, ResetPasswordData>(resetPassword, options);

export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  try {
    const response = await axiosClient.post('/auth/reset-password', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Reset password failed' };
  }
};
