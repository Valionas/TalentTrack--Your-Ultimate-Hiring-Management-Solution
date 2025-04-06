import { useQuery, useMutation, UseQueryOptions, UseMutationOptions, UseQueryResult, UseMutationResult } from 'react-query';
import axiosClient from '../axiosClient';
import { Message, MessageResponse } from '../../packages/models/Message';
import { ErrorResponseModel } from '../../packages/models/Error';

// Fetch all messages
export const useMessagesQuery = (options?: UseQueryOptions<MessageResponse[], ErrorResponseModel>): UseQueryResult<MessageResponse[], ErrorResponseModel> =>
    useQuery<MessageResponse[], ErrorResponseModel>('messages', fetchMessages, options);

export const fetchMessages = async (): Promise<MessageResponse[]> => {
    const response = await axiosClient.get('/messages');
    return response.data;
};

// Send (create) a new message
export const useSendMessageMutation = (options?: UseMutationOptions<MessageResponse, ErrorResponseModel, Message>): UseMutationResult<MessageResponse, ErrorResponseModel, Message> =>
    useMutation<MessageResponse, ErrorResponseModel, Message>(sendMessage, options);

export const sendMessage = async (data: Message): Promise<MessageResponse> => {
    const response = await axiosClient.post('/messages', data);
    return response.data;
};

// Update an existing message
export const useUpdateMessageMutation = (options?: UseMutationOptions<MessageResponse, ErrorResponseModel, { id: string, data: Message }>): UseMutationResult<MessageResponse, ErrorResponseModel, { id: string, data: Message }> =>
    useMutation<MessageResponse, ErrorResponseModel, { id: string, data: Message }>(updateMessage, options);

export const updateMessage = async ({ id, data }: { id: string, data: Message }): Promise<MessageResponse> => {
    const response = await axiosClient.put(`/messages/${id}`, data);
    return response.data;
};

// Delete a message
export const useDeleteMessageMutation = (options?: UseMutationOptions<{ message: string }, ErrorResponseModel, string>): UseMutationResult<{ message: string }, ErrorResponseModel, string> =>
    useMutation<{ message: string }, ErrorResponseModel, string>(deleteMessage, options);

export const deleteMessage = async (id: string): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/messages/${id}`);
    return response.data;
};

// Fetch messages by receiver query
export const useMessagesByReceiverQuery = (
    receiver: string,
    options?: UseQueryOptions<MessageResponse[], ErrorResponseModel>
): UseQueryResult<MessageResponse[], ErrorResponseModel> =>
    useQuery<MessageResponse[], ErrorResponseModel>(
        ['messages', 'receiver', receiver],
        () => fetchMessagesByReceiver(receiver),
        options
    );

export const fetchMessagesByReceiver = async (receiver: string): Promise<MessageResponse[]> => {
    const response = await axiosClient.get(`/messages/receiver/${receiver}`);
    return response.data;
};