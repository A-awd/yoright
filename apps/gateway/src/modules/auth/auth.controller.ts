import { Controller, Post, Get, Body, Headers, UnauthorizedException, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class RegisterDto {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

class LoginDto {
  email: string;
  password: string;
}

class SendOtpDto {
  phone: string;
}

class VerifyOtpDto {
  phone: string;
  code: string;
}

class UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register with email and password' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('otp/send')
  @ApiOperation({ summary: 'Send OTP code' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify OTP code' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.phone, dto.code);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    const payload = await this.authService.verifyToken(token);
    
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    
    return this.authService.getProfile(payload.userId);
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() dto: UpdateProfileDto
  ) {
    const token = this.extractToken(authHeader);
    const payload = await this.authService.verifyToken(token);
    
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    
    return this.authService.updateProfile(payload.userId, dto);
  }

  private extractToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    return authHeader.substring(7);
  }
}
