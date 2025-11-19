import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { join } from 'path';
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
  
  await fastify.register(require('@fastify/static'), {
    root: join(__dirname, '../../web/public'),
    prefix: '/',
  });
  
  await fastify.register(require('@fastify/static'), {
    root: join(__dirname, '../../web/admin'),
    prefix: '/admin/',
    decorateReply: false,
  });

  const config = new DocumentBuilder()
    .setTitle('YoRight API')
    .setDescription('Production-grade travel booking API - Arabic first, global ready')
    .setVersion('1.0')
    .addTag('hotels')
    .addTag('bookings')
    .addTag('payments')
    .addTag('auth')
    .addServer(`http://localhost:${port}`, 'Development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.getHttpAdapter().get('/openapi.json', (req, reply) => {
    reply.type('application/json').send(document);
  });

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 YoRight Gateway running on http://0.0.0.0:${port}`);
  logger.log(`📖 API Documentation: http://0.0.0.0:${port}/api-docs`);
  logger.log(`📄 OpenAPI Spec: http://0.0.0.0:${port}/openapi.json`);
  logger.log(`🎭 Mock Mode: ${mockMode ? 'ENABLED' : 'DISABLED'}`);
  logger.log(`🌐 Public Demo: http://0.0.0.0:${port}/`);
  logger.log(`⚙️  Admin Panel: http://0.0.0.0:${port}/admin/`);
}

bootstrap();
