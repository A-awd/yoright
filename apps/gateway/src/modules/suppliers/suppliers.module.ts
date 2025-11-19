import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { RatehawkMockService } from './ratehawk-mock.service';

@Module({
  providers: [SuppliersService, RatehawkMockService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
