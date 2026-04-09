import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = parseInt(process.env.PORT || '5000', 10);
  const mockMode = process.env.MOCK_MODE === '1';

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    { bufferLogs: true }
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  });

  const fastify = app.getHttpAdapter().getInstance();

  // Gzip/Brotli compression for all responses
  await fastify.register(require('@fastify/compress'), {
    encodings: ['br', 'gzip', 'deflate'],
  });

  const webClientDistPath = join(__dirname, '../../web-client/dist');

  if (existsSync(webClientDistPath)) {
    const assetsPath = join(webClientDistPath, 'assets');
    if (existsSync(assetsPath)) {
      await fastify.register(require('@fastify/static'), {
        root: assetsPath,
        prefix: '/assets/',
        decorateReply: false,
        maxAge: '1y',
        immutable: true,
      });
    }

    // Serve images with long cache
    const imagesPath = join(webClientDistPath, 'images');
    if (existsSync(imagesPath)) {
      await fastify.register(require('@fastify/static'), {
        root: imagesPath,
        prefix: '/images/',
        decorateReply: false,
        maxAge: '30d',
      });
    }

    logger.log(`React App: Serving from ${webClientDistPath}`);
  } else {
    logger.warn(`React build not found at ${webClientDistPath}`);
    logger.warn(`Run: cd apps/web-client && npm install && npm run build`);
  }

  const config = new DocumentBuilder()
    .setTitle('YoRight API')
    .setDescription('Travel booking API')
    .setVersion('1.0')
    .addTag('hotels')
    .addTag('bookings')
    .addTag('payments')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.getHttpAdapter().get('/openapi.json', (req, reply) => {
    reply.type('application/json').send(document);
  });

  await app.listen(port, '0.0.0.0');

  logger.log(`YoRight Gateway running on port ${port}`);
  logger.log(`Mock Mode: ${mockMode ? 'ENABLED' : 'DISABLED'}`);
}

bootstrap();
