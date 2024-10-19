import { useQuery, useMutation, UseQueryOptions, UseMutationOptions, UseQueryResult, UseMutationResult } from 'react-query';
import axiosClient from '../axiosClient';
import { UserProfile, UserProfileResponse } from '../../packages/models/UserProfile';
import { ErrorResponseModel } from '../../packages/models/Error';

// Fetch user profile query
export const useUserProfileQuery = (options?: UseQueryOptions<UserProfileResponse, ErrorResponseModel>): UseQueryResult<UserProfileResponse, ErrorResponseModel> =>
  useQuery<UserProfileResponse, ErrorResponseModel>('userProfile', fetchUserProfile, options);

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await axiosClient.get('/users/profile');
  return response.data;
};

// Update user profile mutation
export const useUpdateUserProfileMutation = (options?: UseMutationOptions<UserProfileResponse, ErrorResponseModel, UserProfile>): UseMutationResult<UserProfileResponse, ErrorResponseModel, UserProfile> =>
  useMutation<UserProfileResponse, ErrorResponseModel, UserProfile>(updateUserProfile, options);

export const updateUserProfile = async (data: UserProfile): Promise<UserProfileResponse> => {
  try {
    const response = await axiosClient.put('/users/profile', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update user profile' };
  }
};
