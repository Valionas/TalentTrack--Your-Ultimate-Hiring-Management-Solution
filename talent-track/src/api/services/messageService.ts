import {
    useQuery,
    useMutation,
    UseQueryOptions,
    UseMutationOptions,
    UseQueryResult,
    UseMutationResult,
} from 'react-query';
import axiosClient from '../axiosClient';
import { Message, MessageResponse } from '../../packages/models/Message';
import { ErrorResponseModel } from '../../packages/models/Error';

/* ---------- fetch all ---------- */
export const useMessagesQuery = (
    options?: UseQueryOptions<MessageResponse[], ErrorResponseModel>
): UseQueryResult<MessageResponse[], ErrorResponseModel> =>
    useQuery<MessageResponse[], ErrorResponseModel>('messages', fetchMessages, options);

export const fetchMessages = async (): Promise<MessageResponse[]> => {
    const response = await axiosClient.get('/messages');
    return response.data;
};

/* ---------- create ------------- */
export const useSendMessageMutation = (
    options?: UseMutationOptions<MessageResponse, ErrorResponseModel, Message>
): UseMutationResult<MessageResponse, ErrorResponseModel, Message> =>
    useMutation<MessageResponse, ErrorResponseModel, Message>(sendMessage, options);

export const sendMessage = async (data: Message): Promise<MessageResponse> => {
    const response = await axiosClient.post('/messages', data);
    return response.data;
};

/* ---------- update (partial) --- */
export const useUpdateMessageMutation = (
    options?: UseMutationOptions<
        MessageResponse,
        ErrorResponseModel,
        { id: string; data: Partial<Message> }
    >
): UseMutationResult<
    MessageResponse,
    ErrorResponseModel,
    { id: string; data: Partial<Message> }
> =>
    useMutation<MessageResponse, ErrorResponseModel, { id: string; data: Partial<Message> }>(
        updateMessage,
        options
    );

export const updateMessage = async ({
    id,
    data,
}: {
    id: string;
    data: Partial<Message>;
}): Promise<MessageResponse> => {
    const response = await axiosClient.put(`/messages/${id}`, data);
    return response.data;
};

/* ---------- delete (soft delete per user) ------------- */
export const useDeleteMessageMutation = (
    options?: UseMutationOptions<
        { message: string },
        ErrorResponseModel,
        { id: string; userId: string }
    >
): UseMutationResult<{ message: string }, ErrorResponseModel, { id: string; userId: string }> =>
    useMutation<{ message: string }, ErrorResponseModel, { id: string; userId: string }>(
        deleteMessage,
        options
    );

export const deleteMessage = async ({
    id,
    userId,
}: {
    id: string;
    userId: string;
}): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/messages/${id}`, {
        data: { userId },
    });
    return response.data;
};

/* ---------- inbox (by receiver) */
export const useMessagesByReceiverQuery = (
    receiver: string,
    options?: UseQueryOptions<MessageResponse[], ErrorResponseModel>
): UseQueryResult<MessageResponse[], ErrorResponseModel> =>
    useQuery<MessageResponse[], ErrorResponseModel>(
        ['messages', 'receiver', receiver],
        () => fetchMessagesByReceiver(receiver),
        options
    );

export const fetchMessagesByReceiver = async (
    receiver: string
): Promise<MessageResponse[]> => {
    const response = await axiosClient.get(`/messages/receiver/${receiver}`);
    return response.data;
};
