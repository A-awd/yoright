import { Injectable } from '@nestjs/common';
import { FlagsService } from '../../core/flags/flags.service';

@Injectable()
export class AdminService {
  constructor(private flags: FlagsService) {}

  async getAllBookings() {
    return {
      bookings: [],
      total: 0,
    };
  }

  async getWebhookLogs() {
    return {
      logs: [],
      total: 0,
    };
  }

  async getFlags() {
    return this.flags.getAll();
  }

  async toggleFlag(flag: string, value: boolean) {
    this.flags.updateFlag(flag as any, value);
    return {
      success: true,
      flag,
      value,
    };
  }
}
