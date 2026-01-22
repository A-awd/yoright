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

class BookingFormDto {
  bookHash: string;
  bookingReference: string;
  language?: string;
}

class BookingFinishDto {
  bookingReference: string;
  guests: Array<{
    firstName: string;
    lastName: string;
    isChild?: boolean;
    age?: number;
  }>;
  paymentType: {
    type: 'deposit' | 'now' | 'hotel';
    amount: string;
    currencyCode: string;
  };
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

  @Post('booking-form')
  @ApiOperation({ summary: 'Step 2: Create booking form after prebook (RateHawk flow)' })
  async bookingForm(@Body() dto: BookingFormDto) {
    const prebookResult = this.suppliersService.validatePrebookHash(dto.bookHash);
    if (!prebookResult) {
      return {
        success: false,
        error: 'Invalid or expired book hash. Please prebook the room again.',
      };
    }

    const result = await this.suppliersService.bookingForm(
      dto.bookingReference,
      dto.bookHash,
      dto.language || 'en',
    );
    
    return {
      success: true,
      data: result,
    };
  }

  @Post('booking-finish')
  @ApiOperation({ summary: 'Step 3: Complete booking with guest details (RateHawk flow)' })
  async bookingFinish(
    @Body() dto: BookingFinishDto,
    @Ip() userIp?: string,
  ) {
    const result = await this.suppliersService.bookingFinish({
      partnerOrderId: dto.bookingReference,
      language: 'en',
      guests: dto.guests,
      paymentType: dto.paymentType,
      userIp,
    });

    if (result.status === 'ok') {
      await this.bookingsService.updateBookingStatus(
        dto.bookingReference,
        BookingStatus.CONFIRMED,
        result.itemId || result.orderId,
      );
    } else if (result.errorCode) {
      await this.bookingsService.updateBookingStatus(
        dto.bookingReference,
        BookingStatus.CANCELLED,
      );
    }

    return {
      success: result.status === 'ok',
      data: result,
    };
  }

  @Post('check-status')
  @ApiOperation({ summary: 'Step 4: Check booking process status (RateHawk flow)' })
  async checkBookingStatus(@Body() body: { bookingReference: string }) {
    const result = await this.suppliersService.checkBookingProcess(body.bookingReference);

    if (result.status === 'ok') {
      await this.bookingsService.updateBookingStatus(
        body.bookingReference,
        BookingStatus.CONFIRMED,
        result.itemId || result.orderId,
      );
      return {
        success: true,
        status: 'confirmed',
        confirmationNumber: result.itemId,
        orderId: result.orderId,
      };
    } else if (result.status === 'error') {
      await this.bookingsService.updateBookingStatus(
        body.bookingReference,
        BookingStatus.CANCELLED,
      );
      return {
        success: false,
        status: 'failed',
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
      };
    } else {
      return {
        success: false,
        status: 'pending',
        message: 'Booking is still being processed. Please check again.',
      };
    }
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm booking after prebook (simplified legacy flow)' })
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

    await this.suppliersService.bookingForm(
      dto.bookingReference,
      dto.bookHash,
      'en',
    );

    const finishResult = await this.suppliersService.bookingFinish({
      partnerOrderId: dto.bookingReference,
      language: 'en',
      guests: dto.guests,
      paymentType: {
        type: 'deposit',
        amount: prebookResult.finalPrice?.toString() || '0',
        currencyCode: prebookResult.currencyCode || 'SAR',
      },
      userIp,
    });

    if (finishResult.status !== 'ok') {
      const statusResult = await this.suppliersService.checkBookingProcess(dto.bookingReference);
      
      if (statusResult.status === 'ok') {
        await this.bookingsService.updateBookingStatus(
          dto.bookingReference,
          BookingStatus.CONFIRMED,
          statusResult.itemId || statusResult.orderId,
        );
        return {
          success: true,
          booking: {
            reference: dto.bookingReference,
            status: 'confirmed',
            confirmationNumber: statusResult.itemId,
          },
        };
      } else if (statusResult.status === 'error') {
        await this.bookingsService.updateBookingStatus(
          dto.bookingReference,
          BookingStatus.CANCELLED,
        );
        return {
          success: false,
          error: statusResult.errorMessage || 'Booking failed',
          errorCode: statusResult.errorCode,
        };
      } else {
        return {
          success: false,
          status: 'pending',
          message: 'Booking is being processed. Please check status later.',
          reference: dto.bookingReference,
        };
      }
    }

    await this.bookingsService.updateBookingStatus(
      dto.bookingReference,
      BookingStatus.CONFIRMED,
      finishResult.itemId || finishResult.orderId,
    );

    return {
      success: true,
      booking: {
        reference: dto.bookingReference,
        status: 'confirmed',
        confirmationNumber: finishResult.itemId || finishResult.orderId,
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
