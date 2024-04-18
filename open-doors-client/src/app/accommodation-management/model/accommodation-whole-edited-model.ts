import { Country } from "src/app/shared/model/country";
import { SeasonalRate } from "./seasonal-rate.model";
import { DateRange } from "./date-range.model";
import { Image } from "./image.model";
import { AccommodationType } from "src/app/accommodation-management/model/accommodation-type";
export interface AccommodationWholeEdited {
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
    
    availability: DateRange[],
    price: number,
    isPricePerGuest: boolean,
    seasonalRates: SeasonalRate[],

    hostUsername: string,
    
    images: number[],
    toDeleteImages: number[]
}