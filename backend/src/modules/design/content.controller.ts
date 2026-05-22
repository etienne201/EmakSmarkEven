import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateContentDto, UpdateContentDto } from './dto/content.dto';

@ApiTags('Design & Content')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContentController {

  @Get('events/:id/content')
  @ApiOperation({ summary: 'Lister les contenus d un événement' })
  async findAll(@Param('id') id: string) {
    return [];
  }

  @Post('events/:id/content')
  @ApiOperation({ summary: 'Ajouter un bloc de contenu' })
  async create(@Param('id') id: string, @Body() dto: CreateContentDto) {
    return { success: true };
  }

  @Put('content/:id')
  @ApiOperation({ summary: 'Modifier un bloc de contenu' })
  async update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return { success: true };
  }

  @Delete('content/:id')
  @ApiOperation({ summary: 'Supprimer un bloc de contenu' })
  async remove(@Param('id') id: string) {
    return { success: true };
  }
}
