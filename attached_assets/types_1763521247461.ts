export enum Currency {
  SAR = 'SAR',
  USD = 'USD',
  EUR = 'EUR',
}

export enum Language {
  AR = 'ar',
  EN = 'en',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  lat: number;
  lng: number;
  image: string;
}

export interface Amenity {
  icon: string;
  labelAr: string;
  labelEn: string;
}

export interface Room {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number; // Base currency SAR
  capacity: number;
  bedType: string;
  breakfastIncluded: boolean;
  freeCancellation: boolean;
}

export interface Hotel {
  id: string;
  nameAr: string;
  nameEn: string;
  cityId: string;
  stars: number;
  rating: number;
  reviewCount: number;
  location: {
    lat: number;
    lng: number;
    addressAr: string;
    addressEn: string;
    distanceToCenterKm: number;
  };
  thumbnail: string;
  images: string[];
  amenities: string[]; // IDs of amenities
  minPrice: number;
  rooms: Room[];
  descriptionAr: string;
  descriptionEn: string;
}

export interface Booking {
  id: string;
  reference: string; // e.g., YR-123456
  userId: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  currency: Currency;
  status: BookingStatus;
  guestName: string;
  guestEmail: string;
  createdAt: string;
}

export interface SearchParams {
  cityId?: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
}

export interface CityIntelligence {
  weather: string;
  costOfLiving: string;
  tips: string;
  flightInfo: string;
}
