import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mockMode: process.env.MOCK_MODE === '1',
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Basic metrics endpoint' })
  metrics() {
    return {
      process: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
