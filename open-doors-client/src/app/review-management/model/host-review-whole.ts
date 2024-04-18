export interface HostReviewWholeDTO {
    id: number,
    rating: number,
    comment: string,
    authorId: number,
    recipientId: number,
    timestamp: Date,
    reported: boolean
}