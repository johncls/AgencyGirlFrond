export interface User {
    id: number;
    identification: string;
    name: string;
    phoneNumber: string;
    message: string;
    messageCount: number;
    status: string;
    lastMessage: string;
    isActive: boolean;
}

export interface UserLogin {
    identification: string;
    password: string;
}

export interface UserCreate {
    identification: string;
    name: string;
    phoneNumber: string;
    message: string;
    isActive: boolean;
}