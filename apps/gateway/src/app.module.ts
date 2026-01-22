import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuthModule } from './modules/auth/auth.module';
import { FxModule } from './modules/fx/fx.module';
import { CityIntelModule } from './modules/city-intel/city-intel.module';
import { AdminModule } from './modules/admin/admin.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { DatabaseModule } from './core/database/database.module';
import { LoggerModule } from './core/logger/logger.module';
import { FlagsModule } from './core/flags/flags.module';
import { SpaFallbackController } from './spa-fallback.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    DatabaseModule,
    FlagsModule,
    HealthModule,
    AuthModule,
    HotelsModule,
    BookingsModule,
    PaymentsModule,
    FxModule,
    CityIntelModule,
    AdminModule,
    WebhooksModule,
  ],
  controllers: [SpaFallbackController],
})
export class AppModule {}
