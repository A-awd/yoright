import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
import { BookingStatus } from '@prisma/client';

interface CreateBookingDto {
  hotelId: string;
  cityId: string;
  roomData: Record<string, any>;
  guestInfo: Record<string, any>;
  checkIn: string;
  checkOut: string;
  total: number;
  vat: number;
  currency?: string;
  userId?: string;
  supplier?: string;
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private db: DatabaseService) {}

  async createBooking(data: CreateBookingDto) {
    const reference = this.generateReference();
    
    const booking = await this.db.booking.create({
      data: {
        reference,
        cityId: data.cityId,
        hotelId: data.hotelId,
        roomJson: data.roomData || {},
        guestJson: data.guestInfo || {},
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        total: data.total,
        vat: data.vat || 0,
        currency: data.currency || 'SAR',
        userId: data.userId || undefined,
        supplier: data.supplier || 'RATEHAWK',
      },
    });

    this.logger.log(`Booking created: ${reference}`);
    return booking;
  }

  async getBookingByReference(reference: string) {
    const booking = await this.db.booking.findUnique({
      where: { reference },
      include: {
        payments: true,
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        city: true,
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async getUserBookings(userId: string) {
    return this.db.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        payments: {
          select: { id: true, status: true, amount: true }
        },
        city: {
          select: { nameEn: true, nameAr: true }
        }
      }
    });
  }

  async getAllBookings(filters?: { status?: BookingStatus; limit?: number; offset?: number }) {
    const where = filters?.status ? { status: filters.status } : {};
    
    return this.db.booking.findMany({
      where,
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        payments: {
          select: { id: true, status: true, amount: true }
        },
        city: {
          select: { nameEn: true, nameAr: true }
        }
      }
    });
  }

  async updateBookingStatus(reference: string, status: BookingStatus, supplierRef?: string) {
    const updateData: any = { status };
    
    if (status === 'CONFIRMED') {
      updateData.paidAt = new Date();
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
    }
    
    if (supplierRef) {
      updateData.supplierRef = supplierRef;
    }

    const booking = await this.db.booking.update({
      where: { reference },
      data: updateData,
    });

    return booking;
  }

  private generateReference(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `YR-${timestamp}-${random}`;
  }
}
