import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FxService } from './fx.service';

@ApiTags('fx')
@Controller('api/fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get latest exchange rates' })
  async getLatest() {
    return this.fxService.getLatestRates();
  }
}
