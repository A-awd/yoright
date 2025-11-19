import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  private bookingsStore: Map<string, any> = new Map();

  constructor(private db: DatabaseService) {}

  async createBooking(data: any) {
    const reference = this.generateReference();
    const booking = {
      id: reference,
      reference,
      status: 'PENDING',
      currency: 'SAR',
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.bookingsStore.set(reference, booking);
    this.logger.log(`Booking created: ${reference}`);

    return booking;
  }

  async getBookingByReference(reference: string) {
    const booking = this.bookingsStore.get(reference);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async updateBookingStatus(reference: string, status: string) {
    const booking = this.bookingsStore.get(reference);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date().toISOString();
      this.bookingsStore.set(reference, booking);
    }
    return booking;
  }

  private generateReference(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `YR-${timestamp}-${random}`;
  }
}
