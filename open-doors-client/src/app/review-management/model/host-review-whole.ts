export interface HostReviewWholeDTO {
    id: number,
    rating: number,
    comment: string,
    authorId: string,
    recipientId: string,
    timestamp: Date,
    reported: boolean
}