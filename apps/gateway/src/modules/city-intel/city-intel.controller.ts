import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CityIntelService } from './city-intel.service';

@ApiTags('city-intel')
@Controller('api/cityintel')
export class CityIntelController {
  constructor(private readonly cityIntelService: CityIntelService) {}

  @Get(':cityId')
  @ApiOperation({ summary: 'Get city intelligence data' })
  async getCityIntel(
    @Param('cityId') cityId: string,
    @Query('month') month?: string,
  ) {
    return this.cityIntelService.getCityIntel(cityId, month);
  }
}
