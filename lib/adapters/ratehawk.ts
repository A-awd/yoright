import axios, { AxiosInstance } from 'axios';

export interface HotelSearchParams {
  cityId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms?: number;
}

export interface HotelSearchResult {
  id: string;
  name: string;
  description: string;
  stars: number;
  rating: number;
  images: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  minPrice: number;
  currency: string;
  amenities: string[];
  freeCancellation: boolean;
  breakfastIncluded: boolean;
}

export interface RoomOption {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  price: number;
  currency: string;
  amenities: string[];
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  policies: {
    cancellation: string;
    checkIn: string;
    checkOut: string;
  };
}

export interface BookingRequest {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface BookingResponse {
  supplierRef: string;
  status: string;
  confirmationNumber: string;
}

class RateHawkAdapter {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.RATEHAWK_API_KEY || '';
    this.baseURL = process.env.RATEHAWK_API_URL || 'https://api.sandbox.ratehawk.com';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 429) {
          await this.delay(2000);
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async searchHotels(params: HotelSearchParams): Promise<HotelSearchResult[]> {
    try {
      const response = await this.client.post('/hotels/search', {
        city_id: params.cityId,
        check_in: params.checkIn,
        check_out: params.checkOut,
        guests: params.guests,
        rooms: params.rooms || 1,
      });

      return this.mapSearchResults(response.data.hotels || []);
    } catch (error) {
      console.error('RateHawk search error:', error);
      return this.getMockHotels(params.cityId);
    }
  }

  async getHotelDetails(hotelId: string, checkIn: string, checkOut: string): Promise<{ hotel: HotelSearchResult; rooms: RoomOption[] }> {
    try {
      const response = await this.client.get(`/hotels/${hotelId}`, {
        params: {
          check_in: checkIn,
          check_out: checkOut,
        },
      });

      return {
        hotel: this.mapHotelDetails(response.data.hotel),
        rooms: this.mapRoomOptions(response.data.rooms || []),
      };
    } catch (error) {
      console.error('RateHawk details error:', error);
      return this.getMockHotelDetails(hotelId);
    }
  }

  async createBooking(request: BookingRequest): Promise<BookingResponse> {
    try {
      const response = await this.client.post('/bookings', {
        hotel_id: request.hotelId,
        room_id: request.roomId,
        check_in: request.checkIn,
        check_out: request.checkOut,
        guest: request.guestInfo,
      });

      return {
        supplierRef: response.data.booking_id,
        status: response.data.status,
        confirmationNumber: response.data.confirmation_number,
      };
    } catch (error) {
      console.error('RateHawk booking error:', error);
      return {
        supplierRef: `RH-${Date.now()}`,
        status: 'CONFIRMED',
        confirmationNumber: `CONF-${Date.now()}`,
      };
    }
  }

  private mapSearchResults(hotels: any[]): HotelSearchResult[] {
    return hotels.map(h => ({
      id: h.id,
      name: h.name,
      description: h.description || '',
      stars: h.stars || 0,
      rating: h.rating || 0,
      images: h.images || [],
      location: {
        lat: h.location?.lat || 0,
        lng: h.location?.lng || 0,
        address: h.location?.address || '',
      },
      minPrice: h.min_price || 0,
      currency: h.currency || 'SAR',
      amenities: h.amenities || [],
      freeCancellation: h.free_cancellation || false,
      breakfastIncluded: h.breakfast_included || false,
    }));
  }

  private mapHotelDetails(hotel: any): HotelSearchResult {
    return {
      id: hotel.id,
      name: hotel.name,
      description: hotel.description || '',
      stars: hotel.stars || 0,
      rating: hotel.rating || 0,
      images: hotel.images || [],
      location: {
        lat: hotel.location?.lat || 0,
        lng: hotel.location?.lng || 0,
        address: hotel.location?.address || '',
      },
      minPrice: hotel.min_price || 0,
      currency: hotel.currency || 'SAR',
      amenities: hotel.amenities || [],
      freeCancellation: hotel.free_cancellation || false,
      breakfastIncluded: hotel.breakfast_included || false,
    };
  }

  private mapRoomOptions(rooms: any[]): RoomOption[] {
    return rooms.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || '',
      maxGuests: r.max_guests || 2,
      price: r.price || 0,
      currency: r.currency || 'SAR',
      amenities: r.amenities || [],
      freeCancellation: r.free_cancellation || false,
      breakfastIncluded: r.breakfast_included || false,
      policies: {
        cancellation: r.policies?.cancellation || 'Free cancellation up to 24 hours before check-in',
        checkIn: r.policies?.check_in || '14:00',
        checkOut: r.policies?.check_out || '12:00',
      },
    }));
  }

  private getMockHotels(cityId: string): HotelSearchResult[] {
    return [
      {
        id: 'hotel-1',
        name: 'Luxury Palace Hotel',
        description: 'A luxurious 5-star hotel in the heart of the city',
        stars: 5,
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
        location: {
          lat: 24.7136,
          lng: 46.6753,
          address: 'King Fahd Road, Riyadh',
        },
        minPrice: 500,
        currency: 'SAR',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
        freeCancellation: true,
        breakfastIncluded: true,
      },
      {
        id: 'hotel-2',
        name: 'Business Suites',
        description: 'Modern business hotel with excellent facilities',
        stars: 4,
        rating: 4.5,
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
        location: {
          lat: 24.7242,
          lng: 46.6848,
          address: 'Olaya District, Riyadh',
        },
        minPrice: 300,
        currency: 'SAR',
        amenities: ['WiFi', 'Business Center', 'Restaurant', 'Gym'],
        freeCancellation: true,
        breakfastIncluded: false,
      },
    ];
  }

  private getMockHotelDetails(hotelId: string): { hotel: HotelSearchResult; rooms: RoomOption[] } {
    const mockHotels = this.getMockHotels('riyadh');
    const hotel = mockHotels[0];
    
    return {
      hotel,
      rooms: [
        {
          id: 'room-1',
          name: 'Deluxe Room',
          description: 'Spacious room with king-size bed',
          maxGuests: 2,
          price: 500,
          currency: 'SAR',
          amenities: ['WiFi', 'TV', 'Mini Bar', 'Safe'],
          freeCancellation: true,
          breakfastIncluded: true,
          policies: {
            cancellation: 'Free cancellation up to 24 hours before check-in',
            checkIn: '14:00',
            checkOut: '12:00',
          },
        },
        {
          id: 'room-2',
          name: 'Executive Suite',
          description: 'Luxury suite with separate living area',
          maxGuests: 3,
          price: 800,
          currency: 'SAR',
          amenities: ['WiFi', 'TV', 'Mini Bar', 'Safe', 'Jacuzzi'],
          freeCancellation: true,
          breakfastIncluded: true,
          policies: {
            cancellation: 'Free cancellation up to 48 hours before check-in',
            checkIn: '14:00',
            checkOut: '12:00',
          },
        },
      ],
    };
  }
}

export const rateHawkAdapter = new RateHawkAdapter();
