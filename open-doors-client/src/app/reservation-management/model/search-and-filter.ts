import { ReservationRequestStatus } from "./reservation-request-status";

export interface SearchAndFilterDTO {
    accommodationName: string | null;
    startDate: Date | null;
    endDate: Date | null;
    status: ReservationRequestStatus | null;
}