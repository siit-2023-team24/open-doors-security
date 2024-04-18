import { ReservationRequestStatus } from "./reservation-request-status";

interface ReservationRequestForGuestDTO {
  id: number;
  imageId: number;
  accommodationName: string;
  startDate: Date;
  endDate: Date;
  guestNumber: number;
  totalPrice: number | null;
  status: ReservationRequestStatus;
  timestamp: Date;
  hostUsername: string;
}

export { ReservationRequestForGuestDTO };
