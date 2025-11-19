import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TapMockService } from './tap-mock.service';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, TapMockService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
