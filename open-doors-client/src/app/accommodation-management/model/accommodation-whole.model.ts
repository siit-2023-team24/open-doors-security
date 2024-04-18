import { Country } from "src/app/shared/model/country";
import { AccommodationType } from "src/app/accommodation-management/model/accommodation-type";
import { SeasonalRate } from "./seasonal-rate.model";
import { DateRange } from "./date-range.model";
export interface AccommodationWhole {
    id?: number,
    accommodationId?: number,
    name: string,
    isAutomatic: boolean,
    description: string,
    country: Country,
    city: string,
    street: string,
    number: number,
    type: AccommodationType,
    minGuests: number,
    maxGuests: number,
    deadline: number
    amenities: string[],

    location: string,
    images: number[],
    
    availability: DateRange[],
    price: number,
    isPricePerGuest: boolean,
    seasonalRates: SeasonalRate[],

    hostUsername: string
}