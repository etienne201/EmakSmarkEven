import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

import { CreateTableDto, UpdateTableDto } from './dto/table.dto';

@ApiTags('Guests & Attendance')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TablesController {

  @Get('events/:id/tables')
  @ApiOperation({ summary: 'Lister les tables d un événement' })
  async findAll(@Param('id') id: string) {
    return [];
  }

  @Post('events/:id/tables')
  @ApiOperation({ summary: 'Créer une table' })
  async create(@Param('id') id: string, @Body() dto: CreateTableDto) {
    return { success: true };
  }

  @Put('tables/:id')
  @ApiOperation({ summary: 'Modifier une table' })
  async update(@Param('id') id: string, @Body() dto: UpdateTableDto) {
    return { success: true };
  }

  @Delete('tables/:id')
  @ApiOperation({ summary: 'Supprimer une table' })
  async remove(@Param('id') id: string) {
    return { success: true };
  }
}
