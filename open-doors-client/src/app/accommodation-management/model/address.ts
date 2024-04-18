import { Country } from "src/app/shared/model/country";

export interface Address {
    street: string;
    number: number;
    city: string;
    country: Country;
}