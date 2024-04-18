export interface AccommodationSearchDTO {
    id: number;
    image: number;
    name: string;
    averageRating: number;
    price: number;
    isPricePerNight: boolean;
    totalPrice: number | null;
    city: string;
    country: string;
    isFavoriteForGuest: boolean;
}