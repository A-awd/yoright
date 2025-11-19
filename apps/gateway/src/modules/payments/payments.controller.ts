import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

class CreatePaymentIntentDto {
  bookingId: string;
  method: string;
  amount: number;
  currency: string;
}

@ApiTags('payments')
@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  @ApiOperation({ summary: 'Create payment intent' })
  async createIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createIntent(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment status' })
  async getPayment(@Param('id') id: string) {
    return this.paymentsService.getPayment(id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Payment webhook handler' })
  async webhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}
