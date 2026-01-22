import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { FlagsService } from '../../core/flags/flags.service';
import { RatehawkMockService } from './ratehawk-mock.service';
import { RatehawkApiService } from './ratehawk-api.service';

interface SearchParams {
  cityId?: string;
  regionId?: number;
  hotelIds?: string[];
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number[];
  currency?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  stars?: number;
  nights?: number;
}

interface PrebookParams {
  hash: string;
  priceHash: string;
}

export interface PrebookResult {
  prebookHash: string;
  finalPrice: number;
  currencyCode: string;
  isFreeCancellation: boolean;
  cancellationInfo: any;
  vatData: any;
  hotelData: any;
}

interface BookParams {
  partnerOrderId: string;
  bookHash: string;
  guests: Array<{
    firstName: string;
    lastName: string;
    isChild?: boolean;
    age?: number;
  }>;
  paymentType: 'deposit' | 'now' | 'hotel';
  userIp?: string;
}

const prebookCache = new Map<string, PrebookResult>();

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger(SuppliersService.name);

  constructor(
    private flags: FlagsService,
    private ratehawkMock: RatehawkMockService,
    private ratehawkApi: RatehawkApiService,
  ) {}

  private shouldUseMock(): boolean {
    if (this.flags.isEnabled('mockProviders')) {
      return true;
    }
    if (!this.ratehawkApi.isConfigured()) {
      this.logger.log('RateHawk API not configured, falling back to mock data');
      return true;
    }
    return false;
  }

  private readonly cityToRegionId: Record<string, number> = {
    'dubai': 6053839,
    'los_angeles': 2011,
    'losangeles': 2011,
    'la': 2011,
  };

  async searchHotels(params: SearchParams) {
    this.logger.log(`Searching hotels with params: ${JSON.stringify(params)}`);

    if (!this.ratehawkApi.isConfigured()) {
      this.logger.warn('RateHawk API not configured - returning empty results');
      return [];
    }

    if (this.flags.isEnabled('mockProviders')) {
      this.logger.log('Mock providers enabled via flag - using mock data');
      return this.ratehawkMock.searchHotels(params);
    }

    let regionId = params.regionId || this.cityToRegionId[params.cityId?.toLowerCase() || ''];
    
    if (!regionId && params.cityId) {
      this.logger.log(`Region not cached, looking up: ${params.cityId}`);
      try {
        const searchResult = await this.ratehawkApi.multicomplete(params.cityId, 'en');
        if (searchResult.regions && searchResult.regions.length > 0) {
          regionId = searchResult.regions[0].id;
          this.logger.log(`Found region_id ${regionId} for ${params.cityId}`);
        }
      } catch (error) {
        this.logger.error(`Failed to lookup region for ${params.cityId}: ${error.message}`);
      }
    }
    
    if (!regionId) {
      this.logger.error(`No region ID found for city: ${params.cityId}`);
      throw new BadRequestException(`City "${params.cityId}" not found. Please try a different city like Dubai or Los Angeles.`);
    }

    const ratehawkParams = {
      regionId: regionId,
      checkIn: params.checkIn || this.getDefaultCheckIn(),
      checkOut: params.checkOut || this.getDefaultCheckOut(),
      adults: params.adults || 2,
      children: params.children || [],
      currency: 'USD',
    };

    this.logger.log(`Calling RateHawk API with region_id: ${regionId}`);
    
    const response = await this.ratehawkApi.searchByRegion(ratehawkParams);
    
    if (!response || !response.hotels || response.hotels.length === 0) {
      this.logger.log('RateHawk returned no hotels for this search');
      return [];
    }
    
    this.logger.log(`RateHawk returned ${response.hotels.length} hotels`);
    
    const transformedHotels = this.ratehawkApi.transformSearchResponse(response.hotels);
    
    const hotelIds = response.hotels.slice(0, 20).map((h: any) => h.id || h.hid);
    this.logger.log(`Fetching static info for first ${hotelIds.length} hotels...`);
    
    try {
      const hotelInfoMap = await this.ratehawkApi.getHotelsInfoBatch(hotelIds);
      this.logger.log(`Got static info for ${hotelInfoMap.size} hotels`);
      const mapKeys = Array.from(hotelInfoMap.keys()).slice(0, 3);
      this.logger.log(`Map keys sample: ${JSON.stringify(mapKeys)}`);
      
      return transformedHotels.map((hotel: any) => {
        const staticInfo = hotelInfoMap.get(hotel.id) || hotelInfoMap.get(hotel.hid?.toString());
        if (staticInfo) {
          this.logger.log(`Found static info for hotel: ${hotel.id}, images count: ${staticInfo.images?.length || 0}`);
          return {
            ...hotel,
            nameAr: staticInfo.name || hotel.nameAr,
            nameEn: staticInfo.name || hotel.nameEn,
            stars: staticInfo.star_rating || hotel.stars,
            location: {
              ...hotel.location,
              addressAr: staticInfo.address || hotel.location.addressAr,
              addressEn: staticInfo.address || hotel.location.addressEn,
              lat: staticInfo.latitude || hotel.location.lat,
              lng: staticInfo.longitude || hotel.location.lng,
            },
            thumbnail: staticInfo.images?.[0]?.replace('{size}', '640x400') || hotel.thumbnail,
            images: (staticInfo.images || []).map((img: string) => img.replace('{size}', '1024x768')).slice(0, 10) || hotel.images,
            amenities: staticInfo.amenity_groups?.flatMap((g: any) => g.amenities?.map((a: any) => a.title) || []).slice(0, 10) || hotel.amenities,
            rating: staticInfo.serp_filters?.reviews_rating || staticInfo.review_score || hotel.rating,
            reviewCount: staticInfo.reviews_count || hotel.reviewCount,
          };
        }
        return hotel;
      });
    } catch (error) {
      this.logger.warn(`Failed to fetch hotel static info: ${error.message}`);
      return transformedHotels;
    }
  }

  async getHotelDetails(id: string, params?: Partial<SearchParams>) {
    this.logger.log(`Getting hotel details for: ${id}`);

    if (!this.ratehawkApi.isConfigured()) {
      this.logger.warn('RateHawk API not configured - cannot get hotel details');
      throw new BadRequestException('Hotel search service is not configured');
    }

    if (this.flags.isEnabled('mockProviders')) {
      this.logger.log('Mock providers enabled via flag - using mock data');
      return this.ratehawkMock.getHotelDetails(id);
    }

    const ratehawkParams = {
      hotelId: id,
      checkIn: params?.checkIn || this.getDefaultCheckIn(),
      checkOut: params?.checkOut || this.getDefaultCheckOut(),
      adults: params?.adults || 2,
      children: params?.children || [],
      currency: 'USD',
    };

    this.logger.log(`Calling RateHawk hotel page API for hotel: ${id}`);
    const response = await this.ratehawkApi.getHotelPage(ratehawkParams);
    return this.ratehawkApi.transformHotelPageResponse(response);
  }

  async searchRegions(query: string, language: string = 'en') {
    this.logger.log(`Searching regions for query: ${query}`);
    
    if (!this.ratehawkApi.isConfigured()) {
      this.logger.warn('RateHawk API not configured');
      return { hotels: [], regions: [] };
    }

    return this.ratehawkApi.multicomplete(query, language);
  }

  async prebookRoom(params: PrebookParams): Promise<PrebookResult> {
    this.logger.log(`Prebooking room with hash: ${params.hash?.substring(0, 20)}...`);

    if (this.shouldUseMock()) {
      const result = this.mockPrebook(params);
      prebookCache.set(result.prebookHash, result);
      return result;
    }

    try {
      const result = await this.ratehawkApi.prebook({
        hash: params.hash,
        price_hash: params.priceHash,
      });
      prebookCache.set(result.prebookHash, result);
      return result;
    } catch (error) {
      this.logger.error(`RateHawk prebook failed: ${error.message}`);
      throw error;
    }
  }

  validatePrebookHash(bookHash: string): PrebookResult | null {
    return prebookCache.get(bookHash) || null;
  }

  async bookRoom(params: BookParams) {
    this.logger.log(`Booking room for order: ${params.partnerOrderId}`);

    const prebookResult = prebookCache.get(params.bookHash);
    if (!prebookResult) {
      this.logger.warn(`No prebook found for hash: ${params.bookHash?.substring(0, 20)}...`);
    }

    if (this.shouldUseMock()) {
      const result = this.mockBook(params);
      prebookCache.delete(params.bookHash);
      return result;
    }

    try {
      const result = await this.ratehawkApi.book({
        partner_order_id: params.partnerOrderId,
        book_hash: params.bookHash,
        language: 'en',
        guests: params.guests.map(g => ({
          first_name: g.firstName,
          last_name: g.lastName,
          is_child: g.isChild,
          age: g.age,
        })),
        payment_type: params.paymentType,
        user_ip: params.userIp,
      });
      prebookCache.delete(params.bookHash);
      return result;
    } catch (error) {
      this.logger.error(`RateHawk booking failed: ${error.message}`);
      throw error;
    }
  }

  async getOrderStatus(orderId: string) {
    if (this.shouldUseMock()) {
      return {
        orderId,
        status: 'confirmed',
        confirmationNumber: `YR-${orderId}`,
      };
    }

    return this.ratehawkApi.getOrderStatus(orderId);
  }

  async bookingForm(partnerOrderId: string, bookHash: string, language: string = 'en') {
    this.logger.log(`Creating booking form for order: ${partnerOrderId}`);
    
    if (this.shouldUseMock()) {
      return {
        partnerOrderId,
        itemId: `mock_item_${Date.now()}`,
        paymentTypes: [
          { type: 'deposit', amount: '1500.00', currencyCode: 'SAR' },
        ],
        cancellationInfo: {
          freeCancellationBefore: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        hotelData: { name: 'Mock Hotel' },
        roomData: { name: 'Deluxe Room' },
      };
    }

    return this.ratehawkApi.bookingForm(partnerOrderId, bookHash, language);
  }

  async bookingFinish(params: {
    partnerOrderId: string;
    language: string;
    guests: Array<{
      firstName: string;
      lastName: string;
      isChild?: boolean;
      age?: number;
    }>;
    paymentType: {
      type: 'deposit' | 'now' | 'hotel';
      amount: string;
      currencyCode: string;
    };
    userIp?: string;
  }) {
    this.logger.log(`Finishing booking for order: ${params.partnerOrderId}`);
    
    if (this.shouldUseMock()) {
      return {
        orderId: `mock_order_${Date.now()}`,
        partnerOrderId: params.partnerOrderId,
        status: 'ok',
        itemId: `YR-${Date.now().toString(36).toUpperCase()}`,
      };
    }

    return this.ratehawkApi.bookingFinish({
      partnerOrderId: params.partnerOrderId,
      language: params.language,
      guests: params.guests.map(g => ({
        first_name: g.firstName,
        last_name: g.lastName,
        is_child: g.isChild,
        age: g.age,
      })),
      paymentType: params.paymentType,
      userIp: params.userIp,
    });
  }

  async checkBookingProcess(partnerOrderId: string) {
    this.logger.log(`Checking booking process for order: ${partnerOrderId}`);
    
    if (this.shouldUseMock()) {
      return {
        status: 'ok',
        orderId: `mock_order_${Date.now()}`,
        partnerOrderId,
        itemId: `YR-${Date.now().toString(36).toUpperCase()}`,
      };
    }

    return this.ratehawkApi.checkBookingProcess(partnerOrderId);
  }

  async cancelOrder(orderId: string, partnerOrderId?: string) {
    if (this.shouldUseMock()) {
      return {
        orderId,
        status: 'cancelled',
        message: 'Booking cancelled successfully',
      };
    }

    return this.ratehawkApi.cancelOrder(orderId, partnerOrderId);
  }

  async retrieveBookings(params: {
    orderId?: string;
    partnerOrderId?: string;
    createdFrom?: string;
    createdTo?: string;
  }) {
    this.logger.log('Retrieving bookings for display');
    
    if (this.shouldUseMock()) {
      return {
        orders: [],
        total: 0,
      };
    }

    return this.ratehawkApi.retrieveBookings(params);
  }

  private mockPrebook(params: PrebookParams) {
    const mockBookHash = `mock_book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      prebookHash: mockBookHash,
      finalPrice: 1500,
      currencyCode: 'SAR',
      isFreeCancellation: true,
      cancellationInfo: {
        freeCancellationBefore: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        rules: [
          { penalty: { amount: 0, currency: 'SAR' }, start: null, end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
        ],
      },
      vatData: {
        included: true,
        amount: 225,
        rate: 15,
      },
      hotelData: {
        id: 'mock-hotel',
        name: 'Mock Hotel',
        address: 'Mock Address',
        checkIn: '15:00',
        checkOut: '12:00',
      },
    };
  }

  private mockBook(params: BookParams) {
    const confirmationNumber = `YR-${Date.now().toString(36).toUpperCase()}`;
    
    return {
      orderId: `order_${Date.now()}`,
      partnerOrderId: params.partnerOrderId,
      status: 'confirmed',
      confirmationNumber,
      hotelData: {
        id: 'mock-hotel',
        name: 'Luxury Hotel',
        address: 'King Fahd Road, Riyadh',
      },
      roomData: {
        name: 'Deluxe Room',
        checkIn: this.getDefaultCheckIn(),
        checkOut: this.getDefaultCheckOut(),
      },
      guestData: {
        mainGuest: params.guests[0] ? `${params.guests[0].firstName} ${params.guests[0].lastName}` : 'Guest',
        totalGuests: params.guests.length,
      },
      paymentData: {
        amount: 1500,
        currency: 'SAR',
        status: 'paid',
      },
    };
  }

  private getDefaultCheckIn(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  }

  private getDefaultCheckOut(): string {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    return date.toISOString().split('T')[0];
  }

  getApiStatus(): { configured: boolean; mode: string } {
    return {
      configured: this.ratehawkApi.isConfigured(),
      mode: this.shouldUseMock() ? 'mock' : 'live',
    };
  }
}
