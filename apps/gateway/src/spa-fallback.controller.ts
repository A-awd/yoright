import { Get, Controller, Req, Res, OnModuleInit } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

@Controller()
export class SpaFallbackController implements OnModuleInit {
  private cachedHtml: string | null = null;

  onModuleInit() {
    const indexPath = join(__dirname, '../../web-client/dist/index.html');
    if (existsSync(indexPath)) {
      this.cachedHtml = readFileSync(indexPath, 'utf-8');
    }
  }

  @Get('*')
  serveSpa(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const url = req.url;

    if (
      url.startsWith('/api/') ||
      url.startsWith('/health') ||
      url.startsWith('/api-docs') ||
      url.startsWith('/openapi') ||
      url.startsWith('/assets/') ||
      url.startsWith('/images/')
    ) {
      return res.code(404).send({ message: 'Not Found', statusCode: 404 });
    }

    if (this.cachedHtml) {
      return res.type('text/html').send(this.cachedHtml);
    }

    return res.code(404).send({ message: 'Not Found', statusCode: 404 });
  }
}
