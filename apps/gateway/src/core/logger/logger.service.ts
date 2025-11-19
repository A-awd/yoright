import { Injectable, LoggerService as NestLoggerService, Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: NestLogger;

  constructor() {
    this.logger = new NestLogger('YoRight');
  }

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }
}
