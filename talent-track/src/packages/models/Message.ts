// src/packages/models/Message.ts

export interface Message {
    _id?: string;
    date: string;
    sender: string;
    receiver: string;
    topic: string;
    description: string;
    senderId?: string;
    receiverId?: string;
    senderEmail?: string;
    receiverEmail?: string;
    deletedFor?: string[];
}

export interface MessageResponse extends Message {
    _id: string;
}
