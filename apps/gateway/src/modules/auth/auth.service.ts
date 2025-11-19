import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private otpStore = new Map<string, { code: string; expires: Date }>();

  constructor(private db: DatabaseService) {}

  async sendOtp(phone: string) {
    const code = process.env.MOCK_MODE === '1' ? '123456' : this.generateOtp();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    this.otpStore.set(phone, { code, expires });
    this.logger.log(`OTP sent to ${phone}: ${code} (mock mode)`);

    return {
      success: true,
      message: process.env.MOCK_MODE === '1' ? `OTP code is: ${code}` : 'OTP sent successfully',
      expiresIn: 300,
    };
  }

  async verifyOtp(phone: string, code: string) {
    const stored = this.otpStore.get(phone);

    if (!stored) {
      return { success: false, message: 'OTP not found or expired' };
    }

    if (stored.expires < new Date()) {
      this.otpStore.delete(phone);
      return { success: false, message: 'OTP expired' };
    }

    if (stored.code !== code) {
      return { success: false, message: 'Invalid OTP code' };
    }

    this.otpStore.delete(phone);
    const token = this.generateToken(phone);

    return {
      success: true,
      token,
      user: { phone, id: phone },
    };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateToken(phone: string): string {
    return Buffer.from(`${phone}:${Date.now()}`).toString('base64');
  }
}
