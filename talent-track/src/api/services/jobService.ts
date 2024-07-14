import { useQuery, useMutation, UseQueryOptions, UseMutationOptions, UseQueryResult, UseMutationResult } from 'react-query';
import axiosClient from '../axiosClient';
import { Job, JobResponse } from '../../packages/models/Job';
import { ErrorResponseModel } from '../../packages/models/Error';

// Fetch all jobs query
export const useJobsQuery = (options?: UseQueryOptions<JobResponse[], ErrorResponseModel>): UseQueryResult<JobResponse[], ErrorResponseModel> => 
  useQuery<JobResponse[], ErrorResponseModel>('jobs', fetchJobs, options);

export const fetchJobs = async (): Promise<JobResponse[]> => {
  const response = await axiosClient.get('/jobs');
  return response.data;
};

// Fetch job details query
export const useJobDetailsQuery = (id: string, options?: UseQueryOptions<JobResponse, ErrorResponseModel>): UseQueryResult<JobResponse, ErrorResponseModel> =>
  useQuery<JobResponse, ErrorResponseModel>(['job', id], () => fetchJobDetails(id), options);

export const fetchJobDetails = async (id: string): Promise<JobResponse> => {
  const response = await axiosClient.get(`/jobs/${id}`);
  return response.data;
};

// Create job mutation
export const useCreateJobMutation = (options?: UseMutationOptions<JobResponse, ErrorResponseModel, Job>): UseMutationResult<JobResponse, ErrorResponseModel, Job> =>
  useMutation<JobResponse, ErrorResponseModel, Job>(createJob, options);

export const createJob = async (data: Job): Promise<JobResponse> => {
  try {
    const response = await axiosClient.post('/jobs', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to create job' };
  }
};

// Update job mutation
export const useUpdateJobMutation = (options?: UseMutationOptions<JobResponse, ErrorResponseModel, { id: string, data: Job }>): UseMutationResult<JobResponse, ErrorResponseModel, { id: string, data: Job }> =>
  useMutation<JobResponse, ErrorResponseModel, { id: string, data: Job }>(updateJob, options);

export const updateJob = async ({ id, data }: { id: string, data: Job }): Promise<JobResponse> => {
  try {
    const response = await axiosClient.put(`/jobs/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update job' };
  }
};

// Delete job mutation
export const useDeleteJobMutation = (options?: UseMutationOptions<{ message: string }, ErrorResponseModel, string>): UseMutationResult<{ message: string }, ErrorResponseModel, string> =>
  useMutation<{ message: string }, ErrorResponseModel, string>(deleteJob, options);

export const deleteJob = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axiosClient.delete(`/jobs/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to delete job' };
  }
};
