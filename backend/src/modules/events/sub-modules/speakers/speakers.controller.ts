import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

import { CreateSpeakerDto, UpdateSpeakerDto } from './dto/speaker.dto';

@ApiTags('Event Logistics')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SpeakersController {

  @Get('events/:id/speakers')
  @ApiOperation({ summary: 'Lister les intervenants d un événement' })
  async findAll(@Param('id') id: string) {
    return [];
  }

  @Post('events/:id/speakers')
  @ApiOperation({ summary: 'Ajouter un intervenant' })
  async create(@Param('id') id: string, @Body() dto: CreateSpeakerDto) {
    return { success: true };
  }

  @Put('speakers/:id')
  @ApiOperation({ summary: 'Modifier un intervenant' })
  async update(@Param('id') id: string, @Body() dto: UpdateSpeakerDto) {
    return { success: true };
  }

  @Delete('speakers/:id')
  @ApiOperation({ summary: 'Supprimer un intervenant' })
  async remove(@Param('id') id: string) {
    return { success: true };
  }
}
