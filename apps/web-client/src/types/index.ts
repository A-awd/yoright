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
  price: number;
  capacity: number;
  bedType: string;
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  size?: number | string;
  sizeSqm?: number;
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
  amenities: string[];
  minPrice?: number;
  pricePerNight?: number;
  rooms: Room[];
  descriptionAr: string;
  descriptionEn: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Booking {
  id: string;
  reference: string;
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

export interface HotelSearchResponse {
  items: Hotel[];
  total: number;
  currency: string;
  params: {
    cityId?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
  };
}
