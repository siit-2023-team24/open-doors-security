export interface MakeReservationRequestDTO {
    accommodationId: number;
    guestId: number | null;
    startDate: Date;
    endDate: Date;
    numberOfGuests: number;
    totalPrice: number | null;
}
  