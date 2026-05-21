import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Event Logistics')
@Controller('venues')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VenuesController {

  @Get()
  @ApiOperation({ summary: 'Lister tous les lieux' })
  async findAll() {
    return [];
  }

  @Post()
  @ApiOperation({ summary: 'Créer un lieu' })
  async create(@Body() dto: any) {
    return { success: true };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un lieu' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return { success: true };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un lieu' })
  async remove(@Param('id') id: string) {
    return { success: true };
  }
}
