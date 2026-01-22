import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
