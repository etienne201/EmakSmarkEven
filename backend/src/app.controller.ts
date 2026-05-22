import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      service: 'Emak Smart Even API',
      status: 'online',
      version: '1.0',
      baseUrl: '/api/v1',
      docs: '/api/v1/docs',
    };
  }

  @Get('health')
  health() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'Emak Smart Even API',
    };
  }
}