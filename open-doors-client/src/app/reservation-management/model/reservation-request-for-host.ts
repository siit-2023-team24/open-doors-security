import { ReservationRequestStatus } from "./reservation-request-status";

export interface ReservationRequestForHost {
    id: number;
    guestUsername: string;
    accommodationName: string;
    startDate: number;
    endDate: number;
    guestNumber: number;
    totalPrice: number;
    status: ReservationRequestStatus;
    timestamp: number;
    cancelledNumber: number;
  }