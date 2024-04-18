import { DateRange } from "./date-range.model";

export interface SeasonalRate {
    period: DateRange,
    price: number
}