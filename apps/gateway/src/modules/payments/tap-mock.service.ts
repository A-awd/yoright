import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TapMockService {
  private readonly logger = new Logger(TapMockService.name);
  private payments: Map<string, any> = new Map();

  async createIntent(data: any) {
    const intentId = `intent_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const payment = {
      intentId,
      status: 'PENDING',
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.payments.set(intentId, payment);
    this.logger.log(`Mock payment intent created: ${intentId}`);

    setTimeout(() => {
      payment.status = 'AUTHORIZED';
      setTimeout(() => {
        payment.status = 'PAID';
        this.logger.log(`Mock payment completed: ${intentId}`);
      }, 2000);
    }, 1000);

    return {
      intentId,
      status: 'PENDING',
      checkoutUrl: `/mock-checkout/${intentId}`,
    };
  }

  async getPayment(id: string) {
    return this.payments.get(id) || {
      intentId: id,
      status: 'NOT_FOUND',
    };
  }
}
