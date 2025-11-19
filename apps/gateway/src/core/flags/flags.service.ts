import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, watchFile } from 'fs';
import { join } from 'path';

export interface FeatureFlags {
  mockProviders: boolean;
  mapEnabled: boolean;
  installments: boolean;
  experimentalRanking: boolean;
  webhooksEnabled: boolean;
  pdfInvoices: boolean;
}

@Injectable()
export class FlagsService {
  private readonly logger = new Logger(FlagsService.name);
  private flags: FeatureFlags;
  private readonly flagsPath = join(process.cwd(), 'flags.json');

  constructor() {
    this.loadFlags();
    this.watchFlags();
  }

  private loadFlags(): void {
    try {
      const data = readFileSync(this.flagsPath, 'utf-8');
      this.flags = JSON.parse(data);
      this.logger.log(`✅ Feature flags loaded: ${JSON.stringify(this.flags)}`);
    } catch (error) {
      this.logger.warn('⚠️  flags.json not found, using defaults');
      this.flags = {
        mockProviders: process.env.MOCK_MODE === '1',
        mapEnabled: true,
        installments: false,
        experimentalRanking: false,
        webhooksEnabled: true,
        pdfInvoices: true,
      };
    }
  }

  private watchFlags(): void {
    watchFile(this.flagsPath, () => {
      this.logger.log('🔄 Feature flags file changed, reloading...');
      this.loadFlags();
    });
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag] ?? false;
  }

  getAll(): FeatureFlags {
    return { ...this.flags };
  }

  updateFlag(flag: keyof FeatureFlags, value: boolean): void {
    this.flags[flag] = value;
    this.logger.log(`🔄 Flag updated: ${flag} = ${value}`);
  }
}
