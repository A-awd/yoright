import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SuppliersService } from './suppliers.service';
import { RatehawkMockService } from './ratehawk-mock.service';
import { RatehawkApiService } from './ratehawk-api.service';

@Module({
  imports: [ConfigModule],
  providers: [SuppliersService, RatehawkMockService, RatehawkApiService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
