import { Controller, Get, Post, Body, Param, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { AuthService } from '../auth/auth.service';
import { BookingStatus } from '@prisma/client';

class CreateBookingDto {
  hotelId: string;
  cityId: string;
  roomData: Record<string, any>;
  guestInfo: Record<string, any>;
  checkIn: string;
  checkOut: string;
  total: number;
  vat: number;
  currency?: string;
  supplier?: string;
}

@ApiTags('bookings')
@Controller('api/bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new booking' })
  async create(
    @Body() dto: CreateBookingDto,
    @Headers('authorization') authHeader?: string,
  ) {
    let userId: string | undefined;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const payload = await this.authService.verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }
    
    return this.bookingsService.createBooking({
      ...dto,
      userId,
    });
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user bookings' })
  async getMyBookings(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    const payload = await this.authService.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    
    return this.bookingsService.getUserBookings(payload.userId);
  }

  @Get(':reference')
  @ApiOperation({ summary: 'Get booking by reference' })
  async getByReference(@Param('reference') reference: string) {
    return this.bookingsService.getBookingByReference(reference);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings (admin)' })
  async getAllBookings(
    @Headers('authorization') authHeader: string,
    @Query('status') status?: BookingStatus,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    const payload = await this.authService.verifyToken(token);
    if (!payload || !['ADMIN', 'SUPER_ADMIN'].includes(payload.role)) {
      throw new UnauthorizedException('Admin access required');
    }
    
    return this.bookingsService.getAllBookings({
      status,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }
}
