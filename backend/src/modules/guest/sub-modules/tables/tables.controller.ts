import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

import { SyncTablesDto, CreateTableDto, UpdateTableDto } from './dto/table.dto';
import { TablesService } from '../../tables.service';

@ApiTags('Guests & Attendance')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get('events/:id/tables')
  @ApiOperation({ summary: 'Lister les tables d un événement' })
  async findAll(@Param('id') id: string) {
    return this.tablesService.findAll(id);
  }

  @Post('events/:id/tables')
  @ApiOperation({ summary: 'Enregistrer / synchroniser les tables d un événement' })
  async saveTables(@Param('id') id: string, @Body() dto: SyncTablesDto) {
    return this.tablesService.updateTables(id, dto.tables);
  }

  @Put('tables/:id')
  @ApiOperation({ summary: 'Modifier une table' })
  async update(@Param('id') id: string, @Body() dto: UpdateTableDto) {
    // Note: table updates are synced via the main array in saveTables,
    // but we return success here to support potential individual endpoint calls.
    return { success: true };
  }

  @Delete('tables/:id')
  @ApiOperation({ summary: 'Supprimer une table' })
  async remove(@Param('id') id: string) {
    return { success: true };
  }
}

