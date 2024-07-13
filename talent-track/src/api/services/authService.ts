import axiosClient from "../axiosClient";
import { useMutation, UseMutationOptions, UseMutationResult } from "react-query";

// Data interfaces
export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Response interfaces
export interface AuthResponse {
  email: string;
  token: string;
}

export interface ErrorResponse {
  message: string;
}

// Register user mutation
export const useRegisterMutation = (options?: UseMutationOptions<AuthResponse, ErrorResponse, RegisterData>): UseMutationResult<AuthResponse, ErrorResponse, RegisterData> =>
  useMutation<AuthResponse, ErrorResponse, RegisterData>(registerUser, options);

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user mutation
export const useLoginMutation = (options?: UseMutationOptions<AuthResponse, ErrorResponse, LoginData>): UseMutationResult<AuthResponse, ErrorResponse, LoginData> =>
  useMutation<AuthResponse, ErrorResponse, LoginData>(loginUser, options);

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Login failed' };
  }
};
