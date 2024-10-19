import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axiosClient from '../axiosClient'; // Your axios client setup
import { UserProfile, UserProfileResponse } from '../../packages/models/UserProfile'; // Assuming UserProfile is already defined
import { ErrorResponseModel } from '../../packages/models/Error';

// Fetch all users query
export const useAllUsersQuery = (options?: UseQueryOptions<UserProfileResponse[], ErrorResponseModel>): UseQueryResult<UserProfileResponse[], ErrorResponseModel> => 
  useQuery<UserProfileResponse[], ErrorResponseModel>('allUsers', fetchAllUsers, options);

export const fetchAllUsers = async (): Promise<UserProfileResponse[]> => {
  const response = await axiosClient.get('/users'); // Assuming this is the endpoint
  return response.data;
};
