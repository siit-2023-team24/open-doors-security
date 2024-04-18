import { ReviewDetailsDTO } from "./review-details";

export interface AccommodationReviewsDTO {
    reviews: ReviewDetailsDTO[],
    isReviewable: boolean,
    unapprovedReview: ReviewDetailsDTO | null
}