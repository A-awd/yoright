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
  private readonly apiId: string;
  private readonly apiToken: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('RATEHAWK_API_URL') || 'https://api-sandbox.worldota.net/api/b2b/v3';
    this.apiId = this.configService.get<string>('RATEHAWK_API_ID') || '';
    this.apiToken = this.configService.get<string>('RATEHAWK_API_TOKEN') || '';
    
    if (this.isConfigured()) {
      this.logger.log('RateHawk API configured with sandbox credentials');
    } else {
      this.logger.warn('RateHawk API credentials not configured - using mock data');
    }
  }

  isConfigured(): boolean {
    return (
      this.apiId !== '' &&
      this.apiToken !== ''
    );
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.apiId}:${this.apiToken}`).toString('base64');
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

    this.logger.log(`Searching by region_id: ${params.regionId}, checkin: ${params.checkIn}, checkout: ${params.checkOut}`);
    return this.makeRequest('/search/serp/region/', requestBody);
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

    return this.makeRequest('/search/serp/hotels/', requestBody);
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

    return this.makeRequest('/search/hp/', requestBody);
  }

  async multicomplete(query: string, language: string = 'en'): Promise<any> {
    const requestBody = {
      query,
      language,
    };

    this.logger.log(`Searching regions/hotels for query: ${query}`);
    return this.makeRequest('/search/multicomplete/', requestBody);
  }

  async getHotelInfo(hotelId: string | number, language: string = 'en'): Promise<any> {
    const requestBody: any = {
      language,
    };

    if (typeof hotelId === 'number' || /^\d+$/.test(hotelId.toString())) {
      requestBody.hid = hotelId.toString();
    } else {
      requestBody.id = hotelId;
    }

    this.logger.log(`Getting hotel info for: ${hotelId}`);
    return this.makeRequest('/hotel/info/', requestBody);
  }

  async getHotelsInfoBatch(hotelIds: (string | number)[], language: string = 'en'): Promise<Map<string, any>> {
    const hotelInfoMap = new Map<string, any>();
    
    const batchSize = 5;
    for (let i = 0; i < Math.min(hotelIds.length, 20); i += batchSize) {
      const batch = hotelIds.slice(i, i + batchSize);
      const promises = batch.map(id => 
        this.getHotelInfo(id, language).catch(err => {
          this.logger.warn(`Failed to get info for hotel ${id}: ${err.message}`);
          return null;
        })
      );
      
      const results = await Promise.all(promises);
      results.forEach((result, idx) => {
        if (result) {
          const id = batch[idx];
          hotelInfoMap.set(id.toString(), result);
        }
      });
    }
    
    return hotelInfoMap;
  }

  async prebook(params: RatehawkPrebookParams): Promise<any> {
    const requestBody = {
      hash: params.hash,
      price_hash: params.price_hash,
    };

    const result = await this.makeRequest<any>('/search/prebook/', requestBody);
    
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

    const result = await this.makeRequest<any>('/order/book/', requestBody);

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

    return this.makeRequest('/order/info/', requestBody);
  }

  async checkBookingProcess(partnerOrderId: string): Promise<any> {
    const requestBody = {
      partner_order_id: partnerOrderId,
    };

    this.logger.log(`Checking booking process for partner_order_id: ${partnerOrderId}`);
    
    const result = await this.makeRequest<any>('/order/booking/finish/status/', requestBody);
    
    return {
      status: result.status,
      orderId: result.order_id,
      partnerOrderId: result.partner_order_id,
      itemId: result.item_id,
      errorCode: result.error?.code,
      errorMessage: result.error?.message,
    };
  }

  async bookingForm(partnerOrderId: string, bookHash: string, language: string = 'en'): Promise<any> {
    const requestBody = {
      partner_order_id: partnerOrderId,
      book_hash: bookHash,
      language: language,
    };

    this.logger.log(`Creating booking form for partner_order_id: ${partnerOrderId}`);
    
    const result = await this.makeRequest<any>('/order/booking/form/', requestBody);
    
    return {
      partnerOrderId: result.partner_order_id,
      itemId: result.item_id,
      paymentTypes: result.payment_types,
      cancellationInfo: result.cancellation_info,
      hotelData: result.hotel_data,
      roomData: result.room_data,
      taxes: result.taxes,
      vatData: result.vat_data,
    };
  }

  async bookingFinish(params: {
    partnerOrderId: string;
    language: string;
    guests: Array<{
      first_name: string;
      last_name: string;
      is_child?: boolean;
      age?: number;
    }>;
    paymentType: {
      type: 'deposit' | 'now' | 'hotel';
      amount: string;
      currencyCode: string;
    };
    userIp?: string;
  }): Promise<any> {
    const requestBody = {
      partner_order_id: params.partnerOrderId,
      language: params.language || 'en',
      guests: params.guests.map(guest => ({
        first_name: guest.first_name,
        last_name: guest.last_name,
        is_child: guest.is_child || false,
        age: guest.age,
      })),
      payment_type: {
        type: params.paymentType.type,
        amount: params.paymentType.amount,
        currency_code: params.paymentType.currencyCode,
      },
      user_ip: params.userIp || '0.0.0.0',
    };

    this.logger.log(`Finishing booking for partner_order_id: ${params.partnerOrderId}`);
    
    const result = await this.makeRequest<any>('/order/booking/finish/', requestBody);

    return {
      orderId: result.order_id,
      partnerOrderId: result.partner_order_id,
      status: result.status,
      itemId: result.item_id,
      errorCode: result.error?.code,
      errorMessage: result.error?.message,
    };
  }

  async cancelOrder(orderId: string, partnerOrderId?: string): Promise<any> {
    const requestBody = {
      order_id: orderId,
      partner_order_id: partnerOrderId,
    };

    return this.makeRequest('/order/cancel/', requestBody);
  }

  async retrieveBookings(params: {
    orderId?: string;
    partnerOrderId?: string;
    createdFrom?: string;
    createdTo?: string;
  }): Promise<any> {
    const requestBody: any = {};
    
    if (params.orderId) requestBody.order_id = params.orderId;
    if (params.partnerOrderId) requestBody.partner_order_id = params.partnerOrderId;
    if (params.createdFrom) requestBody.created_from = params.createdFrom;
    if (params.createdTo) requestBody.created_to = params.createdTo;

    this.logger.log('Retrieving bookings (for display only, not for booking status)');
    
    return this.makeRequest('/order/info/', requestBody);
  }

  private buildGuestsArray(adults: number, children?: number[]): Array<{ adults: number; children: number[] }> {
    return [{
      adults: adults,
      children: children || [],
    }];
  }

  transformSearchResponse(ratehawkData: any[]): any[] {
    return ratehawkData.map(hotel => {
      const firstRate = hotel.rates?.[0];
      const payment = firstRate?.payment_options?.payment_types?.[0];
      const hasBreakfast = firstRate?.meal_data?.has_breakfast || firstRate?.meal?.includes('breakfast');
      const freeCancellation = payment?.cancellation_penalties?.free_cancellation_before != null;
      
      const hotelName = this.formatHotelName(hotel.id);
      const roomName = firstRate?.room_name || 'Standard Room';
      
      return {
        id: hotel.id,
        hid: hotel.hid,
        nameAr: hotelName,
        nameEn: hotelName,
        cityId: '',
        stars: this.estimateStars(firstRate?.rg_ext?.class),
        rating: 8.5,
        reviewCount: 100,
        location: {
          lat: 0,
          lng: 0,
          addressAr: 'دبي، الإمارات',
          addressEn: 'Dubai, UAE',
          distanceToCenterKm: 0,
        },
        thumbnail: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop`,
        images: [`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop`],
        amenities: firstRate?.amenities_data || ['wifi', 'parking', 'pool'],
        minPrice: firstRate?.daily_prices?.[0] || '0',
        pricePerNight: firstRate?.daily_prices?.[0] || '0',
        totalPrice: payment?.amount || '0',
        currency: payment?.currency_code || 'USD',
        freeCancellation,
        breakfastIncluded: hasBreakfast || false,
        roomName,
        rateHash: firstRate?.match_hash,
        matchHash: firstRate?.match_hash,
      };
    });
  }

  private formatHotelName(id: string): string {
    if (!id) return 'Hotel';
    return id
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private estimateStars(roomClass?: number): number {
    if (!roomClass) return 4;
    if (roomClass >= 6) return 5;
    if (roomClass >= 4) return 4;
    if (roomClass >= 2) return 3;
    return 3;
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
        addressAr: ratehawkData.address || ratehawkData.region?.name || '',
        addressEn: ratehawkData.address || ratehawkData.region?.name || '',
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
