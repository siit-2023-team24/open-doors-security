export interface ReviewDetailsDTO {
  id: number,
  rating: number,
  comment: string,
  authorUsername: string,
  imageId?: number,
  timestamp: Date,
  isProcessed: boolean
}
  