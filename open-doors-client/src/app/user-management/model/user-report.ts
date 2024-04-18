export interface UserReportDTO {
    recipientUsername: string,
    complainantUsername: string,
    isComplainantGuest: boolean,
    reason: string,
    id: number;
    timestamp: Date;
    status: string;
}