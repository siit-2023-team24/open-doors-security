export interface SearchAndFilterDTO {
  location: string | null;
  guestNumber: number | null;
  startDate: Date | null;
  endDate: Date | null;
  startPrice: number | null;
  endPrice: number | null;
  types: string[];
  amenities: string[];
}
