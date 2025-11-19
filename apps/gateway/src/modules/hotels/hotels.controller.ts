import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';

@ApiTags('hotels')
@Controller('api/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search hotels' })
  @ApiQuery({ name: 'cityId', required: false })
  @ApiQuery({ name: 'checkIn', required: false })
  @ApiQuery({ name: 'checkOut', required: false })
  @ApiQuery({ name: 'adults', required: false })
  async search(
    @Query('cityId') cityId?: string,
    @Query('checkIn') checkIn?: string,
    @Query('checkOut') checkOut?: string,
    @Query('adults') adults?: string,
  ) {
    const result = await this.hotelsService.searchHotels({
      cityId: cityId || 'riyadh',
      checkIn: checkIn || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkOut: checkOut || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      adults: parseInt(adults || '2'),
    });
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel details' })
  async getHotel(@Param('id') id: string) {
    return this.hotelsService.getHotelDetails(id);
  }
}
