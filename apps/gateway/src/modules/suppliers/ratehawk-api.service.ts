import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface RatehawkSearchParams {
  regionId?: number;
  cityId?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number[];
  currency?: string;
  residency?: string;
  language?: string;
}

interface RatehawkHotelPageParams {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number[];
  currency?: string;
  residency?: string;
  language?: string;
}

interface RatehawkPrebookParams {
  hash: string;
  price_hash: string;
}

interface RatehawkBookParams {
  partner_order_id: string;
  book_hash: string;
  language: string;
  guests: Array<{
    first_name: string;
    last_name: string;
    is_child?: boolean;
    age?: number;
  }>;
  payment_type: 'deposit' | 'now' | 'hotel';
  user_ip?: string;
}

@Injectable()
export class RatehawkApiService {
  private readonly logger = new Logger(RatehawkApiService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly partnerId: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('RATEHAWK_API_URL') || 'https://api.worldota.net/api/b2b/v3';
    this.apiKey = this.configService.get<string>('RATEHAWK_API_KEY') || '';
    this.partnerId = this.configService.get<string>('RATEHAWK_PARTNER_ID') || '';
  }

  isConfigured(): boolean {
    return (
      this.apiKey !== '' &&
      this.apiKey !== 'TO_BE_ADDED_LATER' &&
      this.partnerId !== '' &&
      this.partnerId !== 'TO_BE_ADDED_LATER'
    );
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.partnerId}:${this.apiKey}`).toString('base64');
    return `Basic ${credentials}`;
  }

  private async makeRequest<T>(endpoint: string, body: any): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    
    this.logger.log(`RateHawk API Request: ${endpoint}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`RateHawk API Error: ${response.status} - ${errorText}`);
        throw new Error(`RateHawk API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        this.logger.error(`RateHawk API Error: ${JSON.stringify(data.error)}`);
        throw new Error(data.error?.message || 'RateHawk API Error');
      }

      return data.data;
    } catch (error) {
      this.logger.error(`RateHawk API Request Failed: ${error.message}`);
      throw error;
    }
  }

  async searchByRegion(params: RatehawkSearchParams): Promise<any> {
    const requestBody = {
      checkin: params.checkIn,
      checkout: params.checkOut,
      residency: params.residency || 'sa',
      language: params.language || 'en',
      guests: this.buildGuestsArray(params.adults, params.children),
      region_id: params.regionId,
      currency: params.currency || 'SAR',
    };

    return this.makeRequest('/hotel/search/serp/region/', requestBody);
  }

  async searchByHotelIds(hotelIds: string[], params: RatehawkSearchParams): Promise<any> {
    const requestBody = {
      checkin: params.checkIn,
      checkout: params.checkOut,
      residency: params.residency || 'sa',
      language: params.language || 'en',
      guests: this.buildGuestsArray(params.adults, params.children),
      ids: hotelIds,
      currency: params.currency || 'SAR',
    };

    return this.makeRequest('/hotel/search/serp/hotels/', requestBody);
  }

  async getHotelPage(params: RatehawkHotelPageParams): Promise<any> {
    const requestBody = {
      id: params.hotelId,
      checkin: params.checkIn,
      checkout: params.checkOut,
      residency: params.residency || 'sa',
      language: params.language || 'en',
      guests: this.buildGuestsArray(params.adults, params.children),
      currency: params.currency || 'SAR',
    };

    return this.makeRequest('/hotel/search/hp/', requestBody);
  }

  async prebook(params: RatehawkPrebookParams): Promise<any> {
    const requestBody = {
      hash: params.hash,
      price_hash: params.price_hash,
    };

    const result = await this.makeRequest<any>('/hotel/prebook/', requestBody);
    
    return {
      prebookHash: result.book_hash,
      finalPrice: result.payment_options?.final_price,
      currencyCode: result.payment_options?.currency_code,
      cancellationInfo: result.cancellation_info,
      isFreeCancellation: result.is_free_cancellation,
      vatData: result.vat_data,
      hotelData: result.hotel_data,
    };
  }

  async book(params: RatehawkBookParams): Promise<any> {
    const requestBody = {
      partner_order_id: params.partner_order_id,
      book_hash: params.book_hash,
      language: params.language || 'en',
      guests: params.guests.map(guest => ({
        first_name: guest.first_name,
        last_name: guest.last_name,
        is_child: guest.is_child || false,
        age: guest.age,
      })),
      payment_type: params.payment_type,
      user_ip: params.user_ip || '0.0.0.0',
    };

    const result = await this.makeRequest<any>('/hotel/order/book/', requestBody);

    return {
      orderId: result.order_id,
      partnerOrderId: result.partner_order_id,
      status: result.status,
      hotelData: result.hotel_data,
      roomData: result.room_data,
      guestData: result.guest_data,
      paymentData: result.payment_data,
      confirmationNumber: result.item_id || result.confirmation_number,
    };
  }

  async getOrderStatus(orderId: string): Promise<any> {
    const requestBody = {
      order_id: orderId,
    };

    return this.makeRequest('/hotel/order/info/', requestBody);
  }

  async cancelOrder(orderId: string, partnerOrderId?: string): Promise<any> {
    const requestBody = {
      order_id: orderId,
      partner_order_id: partnerOrderId,
    };

    return this.makeRequest('/hotel/order/cancel/', requestBody);
  }

  private buildGuestsArray(adults: number, children?: number[]): Array<{ adults: number; children: number[] }> {
    return [{
      adults: adults,
      children: children || [],
    }];
  }

  transformSearchResponse(ratehawkData: any[]): any[] {
    return ratehawkData.map(hotel => ({
      id: hotel.id || hotel.hid,
      hid: hotel.hid,
      nameAr: hotel.name,
      nameEn: hotel.name,
      cityId: hotel.region?.id?.toString(),
      stars: hotel.star_rating,
      rating: hotel.rating?.value,
      reviewCount: hotel.rating?.reviews_count,
      location: {
        lat: hotel.latitude,
        lng: hotel.longitude,
        addressAr: hotel.address,
        addressEn: hotel.address,
        distanceToCenterKm: hotel.distance_to_center,
      },
      thumbnail: hotel.images?.[0] || hotel.main_photo_url,
      images: hotel.images || [hotel.main_photo_url],
      amenities: hotel.amenities_short || [],
      minPrice: hotel.rates?.[0]?.daily_prices?.[0] || hotel.min_price,
      pricePerNight: hotel.rates?.[0]?.daily_prices?.[0] || hotel.min_price,
      totalPrice: hotel.rates?.[0]?.payment_options?.payment_types?.[0]?.amount,
      currency: hotel.rates?.[0]?.payment_options?.payment_types?.[0]?.currency_code || 'SAR',
      freeCancellation: hotel.rates?.[0]?.is_free_cancellation || false,
      breakfastIncluded: hotel.rates?.[0]?.meal?.includes('breakfast') || false,
      rateHash: hotel.rates?.[0]?.hash,
      priceHash: hotel.rates?.[0]?.price_hash,
    }));
  }

  transformHotelPageResponse(ratehawkData: any): any {
    return {
      id: ratehawkData.id || ratehawkData.hid,
      hid: ratehawkData.hid,
      nameAr: ratehawkData.name,
      nameEn: ratehawkData.name,
      cityId: ratehawkData.region?.id?.toString(),
      stars: ratehawkData.star_rating,
      rating: ratehawkData.rating?.value,
      reviewCount: ratehawkData.rating?.reviews_count,
      location: {
        lat: ratehawkData.latitude,
        lng: ratehawkData.longitude,
        addressAr: ratehawkData.address,
        addressEn: ratehawkData.address,
      },
      thumbnail: ratehawkData.images?.[0],
      images: ratehawkData.images || [],
      amenities: ratehawkData.amenities || [],
      amenitiesAr: ratehawkData.amenities || [],
      amenitiesEn: ratehawkData.amenities || [],
      descriptionAr: ratehawkData.description,
      descriptionEn: ratehawkData.description,
      minPrice: ratehawkData.rates?.[0]?.daily_prices?.[0],
      pricePerNight: ratehawkData.rates?.[0]?.daily_prices?.[0],
      currency: 'SAR',
      freeCancellation: ratehawkData.rates?.[0]?.is_free_cancellation || false,
      breakfastIncluded: false,
      checkInTime: ratehawkData.check_in_time || '15:00',
      checkOutTime: ratehawkData.check_out_time || '12:00',
      policies: {
        cancellation: ratehawkData.metapolicy_struct?.cancellation?.[0]?.text || '',
        cancellationAr: ratehawkData.metapolicy_struct?.cancellation?.[0]?.text || '',
        pets: ratehawkData.metapolicy_struct?.pets?.[0]?.text || 'Pets not allowed',
        petsAr: 'غير مسموح بالحيوانات الأليفة',
        smoking: ratehawkData.metapolicy_struct?.smoking?.[0]?.text || 'Non-smoking',
        smokingAr: 'غير مسموح بالتدخين',
      },
      rooms: this.transformRooms(ratehawkData.rates || []),
    };
  }

  private transformRooms(rates: any[]): any[] {
    return rates.map((rate, index) => ({
      id: rate.rg_ext?.class?.toString() || `room-${index}`,
      nameAr: rate.room_name || 'غرفة قياسية',
      nameEn: rate.room_name || 'Standard Room',
      descriptionAr: rate.room_description || '',
      descriptionEn: rate.room_description || '',
      maxGuests: rate.rg_ext?.capacity || 2,
      bedType: rate.bed_type || 'King',
      bedTypeAr: 'سرير كينج',
      size: rate.room_size || '35',
      pricePerNight: rate.daily_prices?.[0] || 0,
      totalPrice: rate.payment_options?.payment_types?.[0]?.amount || 0,
      currency: rate.payment_options?.payment_types?.[0]?.currency_code || 'SAR',
      freeCancellation: rate.is_free_cancellation || false,
      freeCancellationBefore: rate.free_cancellation_before,
      breakfastIncluded: rate.meal?.includes('breakfast') || false,
      mealPlan: rate.meal || 'room_only',
      mealPlanAr: this.translateMealPlan(rate.meal),
      amenities: rate.amenities || ['WiFi', 'TV', 'AC'],
      amenitiesAr: ['واي فاي', 'تلفزيون', 'مكيف'],
      images: rate.images || [],
      rateHash: rate.hash,
      priceHash: rate.price_hash,
      cancellationRules: rate.cancellation_info?.rules || [],
    }));
  }

  private translateMealPlan(meal: string): string {
    const mealTranslations: Record<string, string> = {
      'breakfast': 'فطور مشمول',
      'half_board': 'نصف إقامة',
      'full_board': 'إقامة كاملة',
      'all_inclusive': 'شامل كليًا',
      'room_only': 'غرفة فقط',
    };
    return mealTranslations[meal] || 'غرفة فقط';
  }
}
