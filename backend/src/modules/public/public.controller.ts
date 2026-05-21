import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Public API')
@Controller('public')
export class PublicController {

  @Get('events/:slug')
  @ApiOperation({ summary: 'Récupérer un événement via son slug (Public)' })
  async findEvent(@Param('slug') slug: string) {
    return { slug };
  }

  @Get('events/:slug/sessions')
  @ApiOperation({ summary: 'Lister les sessions publiques d un événement' })
  async findSessions(@Param('slug') slug: string) {
    return [];
  }

  @Get('invitations/:code')
  @ApiOperation({ summary: 'Consulter une invitation via son code (Public)' })
  async findInvitation(@Param('code') code: string) {
    return { code };
  }
}
