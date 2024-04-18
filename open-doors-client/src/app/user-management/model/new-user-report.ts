export interface NewUserReportDTO {
    recipientUsername: string,
    complainantUsername: string,
    isComplainantGuest: boolean,
    reason: string
}