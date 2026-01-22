import { Injectable, Logger } from '@nestjs/common';
import { SuppliersService } from '../suppliers/suppliers.service';

export interface SearchParams {
  cityId: string;
  regionId?: number;
  checkIn: string;
  checkOut: string;
  adults: number;
}

@Injectable()
export class HotelsService {
  private readonly logger = new Logger(HotelsService.name);

  constructor(private suppliersService: SuppliersService) {}

  async searchHotels(params: SearchParams) {
    this.logger.log(`Searching hotels: ${JSON.stringify(params)}`);
    const hotels = await this.suppliersService.searchHotels(params);

    return {
      items: hotels,
      total: hotels.length,
      currency: 'SAR',
      params,
    };
  }

  async getHotelDetails(id: string) {
    this.logger.log(`Fetching hotel details: ${id}`);
    return this.suppliersService.getHotelDetails(id);
  }
}
