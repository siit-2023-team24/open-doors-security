export interface AccommodationReviewWholeDTO {
    id: number,
    rating: number,
    comment: string,
    authorId: string,
    recipientId: string,
    timestamp: Date,
    approved: boolean
}