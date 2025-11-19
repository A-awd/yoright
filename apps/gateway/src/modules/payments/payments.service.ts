import { Injectable, Logger } from '@nestjs/common';
import { FlagsService } from '../../core/flags/flags.service';
import { TapMockService } from './tap-mock.service';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private paymentsStore: Map<string, any> = new Map();

  constructor(
    private flags: FlagsService,
    private tapMock: TapMockService,
    private bookingsService: BookingsService,
  ) {}

  async createIntent(data: any) {
    if (this.flags.isEnabled('mockProviders')) {
      return this.tapMock.createIntent(data);
    }
    return this.tapMock.createIntent(data);
  }

  async getPayment(id: string) {
    return this.paymentsStore.get(id) || this.tapMock.getPayment(id);
  }

  async handleWebhook(payload: any) {
    this.logger.log(`Webhook received: ${JSON.stringify(payload)}`);
    
    if (payload.bookingId && payload.status === 'PAID') {
      await this.bookingsService.updateBookingStatus(payload.bookingId, 'CONFIRMED');
    }

    return { received: true };
  }
}
