import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private db: DatabaseService) {}

  async createBooking(data: any) {
    const reference = this.generateReference();
    const booking = await this.db.booking.create({
      data: {
        reference,
        cityId: data.cityId || 'c1',
        hotelId: data.hotelId,
        roomJson: data.roomData || {},
        guestJson: data.guestInfo || {},
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        total: data.total,
        vat: data.vat || 0,
        currency: data.currency || 'SAR',
        userId: data.userId || undefined,
      },
    });

    this.logger.log(`Booking created: ${reference}`);
    return booking;
  }

  async getBookingByReference(reference: string) {
    const booking = await this.db.booking.findUnique({
      where: { reference },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async updateBookingStatus(reference: string, status: BookingStatus) {
    const booking = await this.db.booking.update({
      where: { reference },
      data: { status },
    });

    return booking;
  }

  private generateReference(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `YR-${timestamp}-${random}`;
  }
}
