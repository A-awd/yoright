import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings (admin)' })
  async getAllBookings() {
    return this.adminService.getAllBookings();
  }

  @Get('webhooks')
  @ApiOperation({ summary: 'Get webhook logs' })
  async getWebhookLogs() {
    return this.adminService.getWebhookLogs();
  }

  @Get('flags')
  @ApiOperation({ summary: 'Get feature flags' })
  async getFlags() {
    return this.adminService.getFlags();
  }

  @Post('flags/toggle')
  @ApiOperation({ summary: 'Toggle feature flag' })
  async toggleFlag(@Body() body: { flag: string; value: boolean }) {
    return this.adminService.toggleFlag(body.flag, body.value);
  }
}
