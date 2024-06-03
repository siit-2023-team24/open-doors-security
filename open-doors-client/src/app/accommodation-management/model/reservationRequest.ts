export interface MakeReservationRequestDTO {
    accommodationId: number;
    guestId: string | null;
    startDate: Date;
    endDate: Date;
    numberOfGuests: number;
    totalPrice: number | null;
}
  