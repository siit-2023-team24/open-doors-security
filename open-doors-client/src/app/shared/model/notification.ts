import { NotificationType } from "./notification.type";

export interface Message {
    id?: number;
    timestamp: Date;
    username: string;
    message: string;
    type: NotificationType;
}