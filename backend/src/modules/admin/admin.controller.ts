import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CreateGuestDto } from '../guest/dto/create-guest.dto';

import { UpdateEventConfigDto } from './dto/admin.dto';

@ApiTags('Organization Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('events/:id/stats')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Obtenir les statistiques d un événement' })
  async getStats(@Param('id') id: string) {
    return this.adminService.getEventStats(id);
  }

  @Get('events/:id/guests')
  @Permissions('guests.list')
  @ApiOperation({ summary: 'Lister les invités d un événement' })
  async getGuests(@Param('id') id: string) {
    return this.adminService.getGuests(id);
  }

  @Post('events/:id/config')
  @Permissions('events.settings')
  @ApiOperation({ summary: 'Mettre à jour la configuration d un événement' })
  async updateConfig(@Param('id') id: string, @Body() data: UpdateEventConfigDto) {
    return this.adminService.updateEventConfig(id, data);
  }

  @Post('events/:id/guests')
  @Permissions('guests.create')
  @ApiOperation({ summary: 'Ajouter un invité à un événement' })
  @ApiResponse({ status: 201, description: 'Invité créé avec succès' })
  async addGuest(@Param('id') id: string, @Body() guestData: CreateGuestDto) {
    return this.adminService.addGuest(id, guestData);
  }
}
