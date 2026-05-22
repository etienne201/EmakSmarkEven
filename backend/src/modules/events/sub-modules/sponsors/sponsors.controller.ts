import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

import { CreateSponsorDto, UpdateSponsorDto } from './dto/sponsor.dto';

@ApiTags('Event Logistics')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SponsorsController {

  @Get('events/:id/sponsors')
  @ApiOperation({ summary: 'Lister les sponsors d un événement' })
  async findAll(@Param('id') id: string) {
    return [];
  }

  @Post('events/:id/sponsors')
  @ApiOperation({ summary: 'Ajouter un sponsor' })
  async create(@Param('id') id: string, @Body() dto: CreateSponsorDto) {
    return { success: true };
  }

  @Put('sponsors/:id')
  @ApiOperation({ summary: 'Modifier un sponsor' })
  async update(@Param('id') id: string, @Body() dto: UpdateSponsorDto) {
    return { success: true };
  }

  @Delete('sponsors/:id')
  @ApiOperation({ summary: 'Supprimer un sponsor' })
  async remove(@Param('id') id: string) {
    return { success: true };
  }
}
