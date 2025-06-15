// src/api/services/userService.ts

import { useQuery, useMutation, UseQueryOptions, UseQueryResult, UseMutationOptions, UseMutationResult } from 'react-query';
import axiosClient from '../axiosClient';
import { UserProfileResponse } from '../../packages/models/UserProfile';
import { ErrorResponseModel } from '../../packages/models/Error';

// --- Types -----------------------------------------------------------------

export interface RateUserPayload {
  userId: string;
  grade: number;
}

export interface RateUserResponse {
  user: UserProfileResponse;
}

// --- Queries ----------------------------------------------------------------

/**
 * Fetch all users (for admin / directory views)
 */
export const fetchAllUsers = async (): Promise<UserProfileResponse[]> => {
  const response = await axiosClient.get<UserProfileResponse[]>('/users');
  return response.data;
};

/**
 * React Query hook to fetch all users.
 */
export const useAllUsersQuery = (
  options?: UseQueryOptions<UserProfileResponse[], ErrorResponseModel>
): UseQueryResult<UserProfileResponse[], ErrorResponseModel> =>
  useQuery<UserProfileResponse[], ErrorResponseModel>(
    'allUsers',
    fetchAllUsers,
    options
  );

// --- Mutations --------------------------------------------------------------

/**
 * React Query hook to rate a user.
 * It POSTs { grade } to /users/:userId/rate.
 * Server will read your JWT to know who is rating.
 */
export const useRateUserMutation = (
  options?: UseMutationOptions<RateUserResponse, ErrorResponseModel, RateUserPayload>
): UseMutationResult<RateUserResponse, ErrorResponseModel, RateUserPayload> =>
  useMutation<RateUserResponse, ErrorResponseModel, RateUserPayload>(
    ({ userId, grade }) =>
      axiosClient
        .post<RateUserResponse>(`/users/${userId}/rate`, { grade })
        .then(res => res.data),
    options
  );
