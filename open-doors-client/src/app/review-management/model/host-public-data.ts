import { ReviewDetailsDTO } from "./review-details";

export interface HostPublicDataDTO {
    username: string,
    firstName: string,
    lastName: string,
    reviews: ReviewDetailsDTO[],
    imageId?: number,
    isReviewable: boolean
}