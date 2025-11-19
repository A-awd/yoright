import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FxService {
  private readonly logger = new Logger(FxService.name);
  private cachedRates: any = null;
  private cacheTime: Date | null = null;
  private readonly TTL = 2 * 60 * 60 * 1000;

  async getLatestRates() {
    if (this.cachedRates && this.cacheTime && (Date.now() - this.cacheTime.getTime() < this.TTL)) {
      return this.cachedRates;
    }

    const rates = {
      base: 'SAR',
      rates: {
        SAR: 1,
        USD: 0.267,
        EUR: 0.245,
        AED: 0.98,
        GBP: 0.211,
      },
      timestamp: new Date().toISOString(),
    };

    this.cachedRates = rates;
    this.cacheTime = new Date();
    this.logger.log('FX rates refreshed');

    return rates;
  }
}
