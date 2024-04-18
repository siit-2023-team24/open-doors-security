import { AccommodationType } from "src/app/accommodation-management/model/accommodation-type";
import { DateRange } from "./date-range.model";
import { SeasonalRate } from "./seasonal-rate.model";


export interface AccommodationWithTotalPriceDTO {
    id: number;
    name: string;
    description: string;
    location: string;
    amenities: string[];
    images: number[];
    minGuests: number;
    maxGuests: number;
    accommodationType: AccommodationType;
    availability: DateRange[];
    price: number;
    seasonalRates: SeasonalRate[];
    isPricePerGuest: boolean;
    totalPrice: number | null;
    averageRating: number | null;
    host: string;
    hostUsername?: string;
    country: string;
    city: string;
    street: string;
    number: number;
    isFavoriteForGuest: boolean;
    hostId: number;
    blocked: boolean;
  }