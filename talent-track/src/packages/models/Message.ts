export interface Message {
    date: string;
    sender: string;
    receiver: string;
    description: string;
}

export interface MessageResponse extends Message {
    _id: string | number;
}
