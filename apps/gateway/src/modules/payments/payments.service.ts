import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaymentStatus, BookingStatus } from '@prisma/client';
import { FlagsService } from '../../core/flags/flags.service';
import { TapMockService } from './tap-mock.service';
import { BookingsService } from '../bookings/bookings.service';
import { DatabaseService } from '../../core/database/database.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private flags: FlagsService,
    private tapMock: TapMockService,
    private bookingsService: BookingsService,
    private db: DatabaseService,
  ) {}

  async createIntent(data: any) {
    const booking = await this.db.booking.findUnique({
      where: { reference: data.bookingReference }
    });
    
    if (!booking) {
      throw new NotFoundException(`Booking ${data.bookingReference} not found`);
    }

    const intentResponse = await this.tapMock.createIntent(data);

    await this.db.payment.create({
      data: {
        providerIntentId: intentResponse.intentId,
        bookingId: booking.id,
        amount: data.amount,
        currency: data.currency || 'SAR',
        provider: 'TAP',
        rawJson: data.metadata || null,
      },
    });

    return intentResponse;
  }

  async getPayment(id: string) {
    const payment = await this.db.payment.findFirst({
      where: { providerIntentId: id },
    });

    return payment || this.tapMock.getPayment(id);
  }

  async handleWebhook(payload: any) {
    this.logger.log(`Webhook received: ${JSON.stringify(payload)}`);
    
    if (payload.intentId && payload.status === 'PAID') {
      const payment = await this.db.payment.findFirst({
        where: { providerIntentId: payload.intentId },
        include: { booking: true }
      });

      if (payment) {
        await this.db.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.SUCCEEDED },
        });

        await this.bookingsService.updateBookingStatus(
          payment.booking.reference,
          BookingStatus.PAID
        );
      }
    }

    return { received: true };
  }
}
