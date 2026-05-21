import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Event Logistics')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {

  @Get('events/:id/sessions')
  @ApiOperation({ summary: 'Lister les sessions d un événement' })
  async findAll(@Param('id') id: string) {
    return [];
  }

  @Post('events/:id/sessions')
  @ApiOperation({ summary: 'Créer une session' })
  async create(@Param('id') id: string, @Body() dto: any) {
    return { success: true };
  }

  @Put('sessions/:id')
  @ApiOperation({ summary: 'Modifier une session' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return { success: true };
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Supprimer une session' })
  async remove(@Param('id') id: string) {
    return { success: true };
  }
}
