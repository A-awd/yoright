import { Get, Controller, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

@Controller()
export class SpaFallbackController {
  @Get('*')
  serveSpa(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const url = req.url;
    
    if (
      url.startsWith('/api/') ||
      url.startsWith('/health') ||
      url.startsWith('/api-docs') ||
      url.startsWith('/openapi') ||
      url.startsWith('/assets/')
    ) {
      return res.code(404).send({ message: 'Not Found', statusCode: 404 });
    }

    const indexPath = join(__dirname, '../../web-client/dist/index.html');
    if (existsSync(indexPath)) {
      const html = readFileSync(indexPath, 'utf-8');
      return res.type('text/html').send(html);
    }
    
    return res.code(404).send({ message: 'Not Found', statusCode: 404 });
  }
}
