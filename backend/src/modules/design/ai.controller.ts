import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Design & Content')
@Controller('events/:id/ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIController {

  @Post('generate-theme')
  @ApiOperation({ summary: 'Générer un thème par IA' })
  async generateTheme(@Param('id') id: string, @Body() body: { prompt: string }) {
    return { theme: {} };
  }

  @Post('generate-layout')
  @ApiOperation({ summary: 'Générer une mise en page par IA' })
  async generateLayout(@Param('id') id: string, @Body() body: { prompt: string }) {
    return { layout: {} };
  }

  @Post('generate-invitation')
  @ApiOperation({ summary: 'Générer une invitation par IA' })
  async generateInvitation(@Param('id') id: string, @Body() body: { prompt: string }) {
    return { invitation: {} };
  }

  @Post('suggest-colors')
  @ApiOperation({ summary: 'Suggérer une palette de couleurs par IA' })
  async suggestColors(@Param('id') id: string, @Body() body: { theme: string }) {
    return { colors: [] };
  }
}
