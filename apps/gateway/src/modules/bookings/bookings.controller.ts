import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';

class CreateBookingDto {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }[];
  totals: {
    subtotal: number;
    vat: number;
    total: number;
  };
}

@ApiTags('bookings')
@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new booking' })
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }

  @Get(':reference')
  @ApiOperation({ summary: 'Get booking by reference' })
  async getByReference(@Param('reference') reference: string) {
    return this.bookingsService.getBookingByReference(reference);
  }
}
