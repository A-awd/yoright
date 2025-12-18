import { Controller, Get, Post, Body, Param, Query, Headers, UnauthorizedException, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { AuthService } from '../auth/auth.service';
import { SuppliersService } from '../suppliers/suppliers.service';
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
  rateHash?: string;
  priceHash?: string;
  bookHash?: string;
}

class PrebookDto {
  hash: string;
  priceHash: string;
}

class ConfirmBookingDto {
  bookHash: string;
  bookingReference: string;
  guests: Array<{
    firstName: string;
    lastName: string;
    isChild?: boolean;
    age?: number;
  }>;
}

@ApiTags('bookings')
@Controller('api/bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly authService: AuthService,
    private readonly suppliersService: SuppliersService,
  ) {}

  @Post('prebook')
  @ApiOperation({ summary: 'Prebook a room to get final price and book hash (RateHawk flow)' })
  async prebook(@Body() dto: PrebookDto) {
    const result = await this.suppliersService.prebookRoom({
      hash: dto.hash,
      priceHash: dto.priceHash,
    });
    
    return {
      success: true,
      data: result,
    };
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm booking after prebook (RateHawk flow)' })
  async confirmBooking(
    @Body() dto: ConfirmBookingDto,
    @Headers('authorization') authHeader?: string,
    @Ip() userIp?: string,
  ) {
    let userId: string | undefined;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const payload = await this.authService.verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    const prebookResult = this.suppliersService.validatePrebookHash(dto.bookHash);
    if (!prebookResult) {
      return {
        success: false,
        error: 'Invalid or expired book hash. Please prebook the room again.',
      };
    }

    const booking = await this.bookingsService.getBookingByReference(dto.bookingReference);
    
    const result = await this.suppliersService.bookRoom({
      partnerOrderId: dto.bookingReference,
      bookHash: dto.bookHash,
      guests: dto.guests,
      paymentType: 'deposit',
      userIp,
    });

    await this.bookingsService.updateBookingStatus(
      dto.bookingReference,
      BookingStatus.CONFIRMED,
      result.orderId,
    );

    return {
      success: true,
      booking: {
        reference: dto.bookingReference,
        status: 'confirmed',
        confirmationNumber: result.confirmationNumber || result.orderId,
        hotelData: result.hotelData,
        guestData: result.guestData,
        paymentData: result.paymentData,
        roomData: result.roomData,
      },
    };
  }

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

  @Get('status')
  @ApiOperation({ summary: 'Get supplier API status' })
  async getApiStatus() {
    return this.suppliersService.getApiStatus();
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
