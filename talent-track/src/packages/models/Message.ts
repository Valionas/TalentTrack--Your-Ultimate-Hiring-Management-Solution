export interface Message {
    date: string;
    sender: string;
    receiver: string;
    topic: string;
    description: string;
    senderId?: string;
    receiverId?: string;
    senderEmail?: string;
    receiverEmail?: string;
}

export interface MessageResponse {
    _id: string;
    date: string;
    senderId?: string;
    receiverId?: string;
    sender?: string;
    receiver?: string;
    senderEmail?: string;
    receiverEmail?: string;
    topic: string;
    description: string;
}

