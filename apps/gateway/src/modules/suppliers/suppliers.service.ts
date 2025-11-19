import { Injectable } from '@nestjs/common';
import { FlagsService } from '../../core/flags/flags.service';
import { RatehawkMockService } from './ratehawk-mock.service';

@Injectable()
export class SuppliersService {
  constructor(
    private flags: FlagsService,
    private ratehawkMock: RatehawkMockService,
  ) {}

  async searchHotels(params: any) {
    if (this.flags.isEnabled('mockProviders')) {
      return this.ratehawkMock.searchHotels(params);
    }
    return this.ratehawkMock.searchHotels(params);
  }

  async getHotelDetails(id: string) {
    if (this.flags.isEnabled('mockProviders')) {
      return this.ratehawkMock.getHotelDetails(id);
    }
    return this.ratehawkMock.getHotelDetails(id);
  }
}
