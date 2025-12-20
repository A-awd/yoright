import { Injectable, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yoright-dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 12;

interface TokenPayload {
  userId: string;
  email?: string;
  phone?: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private otpStore = new Map<string, { code: string; expires: Date }>();

  constructor(private db: DatabaseService) {}

  async register(data: { email: string; password: string; name?: string; phone?: string }) {
    const existingUser = await this.db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await this.db.user.create({
      data: {
        email: data.email,
        passwordHash: passwordHash,
        name: data.name,
        phone: data.phone,
      },
    });

    const token = this.generateJwt({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    this.logger.log(`User registered: ${user.email}`);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.db.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateJwt({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    this.logger.log(`User logged in: ${user.email}`);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }

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

    let user = await this.db.user.findFirst({ where: { phone } });
    
    if (!user) {
      user = await this.db.user.create({
        data: { 
          phone,
          email: `${phone}@phone.yoright.com`,
        },
      });
    }

    const token = this.generateJwt({
      userId: user.id,
      phone: user.phone || undefined,
      role: user.role,
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return payload;
    } catch {
      return null;
    }
  }

  async getProfile(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string; phone?: string }) {
    const user = await this.db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
      },
    });

    return user;
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateJwt(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}
