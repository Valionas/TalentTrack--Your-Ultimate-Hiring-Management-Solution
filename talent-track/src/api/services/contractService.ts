// src/api/services/contractService.ts

import {
    useQuery,
    useMutation,
    UseQueryOptions,
    UseMutationOptions,
    UseQueryResult,
    UseMutationResult,
} from 'react-query';
import axiosClient from '../axiosClient';
import { Contract } from '../../packages/models/Contract';
import { ErrorResponseModel } from '../../packages/models/Error';

// 1) Fetch all contracts
export const fetchContracts = async (): Promise<Contract[]> => {
    const response = await axiosClient.get('/contracts');
    return response.data;
};
export const useContractsQuery = (
    options?: UseQueryOptions<Contract[], ErrorResponseModel>
): UseQueryResult<Contract[], ErrorResponseModel> =>
    useQuery<Contract[], ErrorResponseModel>('contracts', fetchContracts, options);

// 2) Fetch a single contract by ID
export const fetchContractDetails = async (id: string): Promise<Contract> => {
    const response = await axiosClient.get(`/contracts/${id}`);
    return response.data;
};
export const useContractDetailsQuery = (
    id: string,
    options?: UseQueryOptions<Contract, ErrorResponseModel>
): UseQueryResult<Contract, ErrorResponseModel> =>
    useQuery<Contract, ErrorResponseModel>(
        ['contract', id],
        () => fetchContractDetails(id),
        options
    );

// 3) Create a contract
export const createContract = async (
    data: Omit<Contract, '_id'>
): Promise<Contract> => {
    const response = await axiosClient.post('/contracts', data);
    return response.data;
};
export const useCreateContractMutation = (
    options?: UseMutationOptions<Contract, ErrorResponseModel, Omit<Contract, '_id'>>
): UseMutationResult<Contract, ErrorResponseModel, Omit<Contract, '_id'>> =>
    useMutation<Contract, ErrorResponseModel, Omit<Contract, '_id'>>(
        createContract,
        options
    );

// 4) Update a contract
export const updateContract = async ({
    id,
    data,
}: {
    id: string;
    data: Partial<Contract>;
}): Promise<Contract> => {
    const response = await axiosClient.put(`/contracts/${id}`, data);
    return response.data;
};
export const useUpdateContractMutation = (
    options?: UseMutationOptions<
        Contract,
        ErrorResponseModel,
        { id: string; data: Partial<Contract> }
    >
): UseMutationResult<
    Contract,
    ErrorResponseModel,
    { id: string; data: Partial<Contract> }
> =>
    useMutation<Contract, ErrorResponseModel, { id: string; data: Partial<Contract> }>(
        updateContract,
        options
    );

// 5) Hard-delete a contract
export const deleteContract = async (id: string): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/contracts/${id}`);
    return response.data;
};
export const useDeleteContractMutation = (
    options?: UseMutationOptions<{ message: string }, ErrorResponseModel, string>
): UseMutationResult<{ message: string }, ErrorResponseModel, string> =>
    useMutation<{ message: string }, ErrorResponseModel, string>(
        deleteContract,
        options
    );

// 6) Soft-delete *for current user only* (push into deletedFor array)
export const softDeleteForCurrentUser = async (
    payload: { id: string; userId: string }
): Promise<Contract> => {
    // This assumes your backend `PUT /contracts/:id` will accept
    // a Mongo $addToSet operator in the body for 'deletedFor'.
    const response = await axiosClient.put(`/contracts/${payload.id}`, {
        $addToSet: { deletedFor: payload.userId }
    });
    return response.data;
};
export const useSoftDeleteForCurrentUser = (
    options?: UseMutationOptions<Contract, ErrorResponseModel, { id: string; userId: string }>
): UseMutationResult<Contract, ErrorResponseModel, { id: string; userId: string }> =>
    useMutation<Contract, ErrorResponseModel, { id: string; userId: string }>(
        softDeleteForCurrentUser,
        options
    );
