import { Controller, Post, Body, Logger, Headers, HttpCode } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '@prisma/client';

interface RatehawkWebhookPayload {
  order_id: string;
  partner_order_id: string;
  status: 'ok' | 'error' | 'pending';
  item_id?: string;
  error?: {
    code: string;
    message: string;
  };
}

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private bookingsService: BookingsService) {}

  @Post('ratehawk/booking-status')
  @HttpCode(200)
  async handleRatehawkBookingStatus(
    @Body() payload: RatehawkWebhookPayload,
    @Headers('x-ratehawk-signature') signature?: string,
  ) {
    this.logger.log(`Received RateHawk webhook for order: ${payload.partner_order_id}`);
    this.logger.log(`Webhook status: ${payload.status}`);

    try {
      const reference = payload.partner_order_id;
      
      if (!reference) {
        this.logger.warn('Webhook received without partner_order_id');
        return { received: true, processed: false, reason: 'missing_partner_order_id' };
      }

      let bookingStatus: BookingStatus;
      let supplierRef: string | undefined;

      switch (payload.status) {
        case 'ok':
          bookingStatus = BookingStatus.CONFIRMED;
          supplierRef = payload.item_id || payload.order_id;
          this.logger.log(`Booking ${reference} confirmed via webhook with supplier ref: ${supplierRef}`);
          break;
        case 'error':
          bookingStatus = BookingStatus.CANCELLED;
          this.logger.error(`Booking ${reference} failed: ${payload.error?.code} - ${payload.error?.message}`);
          break;
        case 'pending':
          bookingStatus = BookingStatus.PENDING;
          this.logger.log(`Booking ${reference} still pending`);
          break;
        default:
          this.logger.warn(`Unknown webhook status: ${payload.status}`);
          return { received: true, processed: false, reason: 'unknown_status' };
      }

      await this.bookingsService.updateBookingStatus(reference, bookingStatus, supplierRef);

      return {
        received: true,
        processed: true,
        reference,
        status: bookingStatus,
      };
    } catch (error) {
      this.logger.error(`Failed to process webhook: ${error.message}`);
      return {
        received: true,
        processed: false,
        error: error.message,
      };
    }
  }
}
