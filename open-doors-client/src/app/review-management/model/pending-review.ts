export interface PendingReview {
    id: number;
    rating: number;
    comment: string;
    timestamp: number;
    authorUsername: string;
    accommodationName: string;
    hostUsername: string;
}