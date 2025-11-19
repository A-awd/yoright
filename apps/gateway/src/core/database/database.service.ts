import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly mockMode = process.env.MOCK_MODE === '1';
  private inMemoryStore: Map<string, any> = new Map();

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    if (!this.mockMode && process.env.DATABASE_URL) {
      try {
        await this.$connect();
        this.logger.log('✅ Connected to PostgreSQL database');
      } catch (error) {
        this.logger.warn('⚠️  Database connection failed, falling back to in-memory store');
      }
    } else {
      this.logger.log('🎭 Running in MOCK_MODE - using in-memory data store');
    }
  }

  async onModuleDestroy() {
    if (!this.mockMode && process.env.DATABASE_URL) {
      await this.$disconnect();
    }
  }

  isUsingInMemory(): boolean {
    return this.mockMode || !process.env.DATABASE_URL;
  }

  getInMemoryStore(collection: string): any[] {
    if (!this.inMemoryStore.has(collection)) {
      this.inMemoryStore.set(collection, []);
    }
    return this.inMemoryStore.get(collection);
  }

  setInMemoryData(collection: string, data: any[]): void {
    this.inMemoryStore.set(collection, data);
  }
}
