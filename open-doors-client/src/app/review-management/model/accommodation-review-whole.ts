export interface AccommodationReviewWholeDTO {
    id: number,
    rating: number,
    comment: string,
    authorId: number,
    recipientId: number,
    timestamp: Date,
    approved: boolean
}