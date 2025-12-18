import { Injectable, Logger } from '@nestjs/common';
import { FlagsService } from '../../core/flags/flags.service';
import { RatehawkMockService } from './ratehawk-mock.service';
import { RatehawkApiService } from './ratehawk-api.service';

interface SearchParams {
  cityId?: string;
  regionId?: number;
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

  async searchHotels(params: SearchParams) {
    this.logger.log(`Searching hotels with params: ${JSON.stringify(params)}`);

    if (this.shouldUseMock()) {
      return this.ratehawkMock.searchHotels(params);
    }

    try {
      const ratehawkParams = {
        regionId: params.regionId,
        cityId: params.cityId,
        checkIn: params.checkIn || this.getDefaultCheckIn(),
        checkOut: params.checkOut || this.getDefaultCheckOut(),
        adults: params.adults || 2,
        children: params.children || [],
        currency: params.currency || 'SAR',
      };

      const response = await this.ratehawkApi.searchByRegion(ratehawkParams);
      return this.ratehawkApi.transformSearchResponse(response.hotels || []);
    } catch (error) {
      this.logger.error(`RateHawk search failed, falling back to mock: ${error.message}`);
      return this.ratehawkMock.searchHotels(params);
    }
  }

  async getHotelDetails(id: string, params?: Partial<SearchParams>) {
    this.logger.log(`Getting hotel details for: ${id}`);

    if (this.shouldUseMock()) {
      return this.ratehawkMock.getHotelDetails(id);
    }

    try {
      const ratehawkParams = {
        hotelId: id,
        checkIn: params?.checkIn || this.getDefaultCheckIn(),
        checkOut: params?.checkOut || this.getDefaultCheckOut(),
        adults: params?.adults || 2,
        children: params?.children || [],
        currency: params?.currency || 'SAR',
      };

      const response = await this.ratehawkApi.getHotelPage(ratehawkParams);
      return this.ratehawkApi.transformHotelPageResponse(response);
    } catch (error) {
      this.logger.error(`RateHawk hotel details failed, falling back to mock: ${error.message}`);
      return this.ratehawkMock.getHotelDetails(id);
    }
  }

  async prebookRoom(params: PrebookParams) {
    this.logger.log(`Prebooking room with hash: ${params.hash?.substring(0, 20)}...`);

    if (this.shouldUseMock()) {
      return this.mockPrebook(params);
    }

    try {
      return await this.ratehawkApi.prebook({
        hash: params.hash,
        price_hash: params.priceHash,
      });
    } catch (error) {
      this.logger.error(`RateHawk prebook failed: ${error.message}`);
      throw error;
    }
  }

  async bookRoom(params: BookParams) {
    this.logger.log(`Booking room for order: ${params.partnerOrderId}`);

    if (this.shouldUseMock()) {
      return this.mockBook(params);
    }

    try {
      return await this.ratehawkApi.book({
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
