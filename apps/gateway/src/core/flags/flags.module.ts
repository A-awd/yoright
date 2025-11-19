import { Module, Global } from '@nestjs/common';
import { FlagsService } from './flags.service';

@Global()
@Module({
  providers: [FlagsService],
  exports: [FlagsService],
})
export class FlagsModule {}
