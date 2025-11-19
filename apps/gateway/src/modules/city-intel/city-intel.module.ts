import { Module } from '@nestjs/common';
import { CityIntelController } from './city-intel.controller';
import { CityIntelService } from './city-intel.service';

@Module({
  controllers: [CityIntelController],
  providers: [CityIntelService],
  exports: [CityIntelService],
})
export class CityIntelModule {}
