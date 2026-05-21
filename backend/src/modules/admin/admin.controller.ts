import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateGuestDto } from '../guest/dto/create-guest.dto';

@ApiTags('Organization Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('events/:id/stats')
  @ApiOperation({ summary: 'Obtenir les statistiques d un événement' })
  async getStats(@Param('id') id: string) {
    return this.adminService.getEventStats(id);
  }

  @Get('events/:id/guests')
  @ApiOperation({ summary: 'Lister les invités d un événement' })
  async getGuests(@Param('id') id: string) {
    return this.adminService.getGuests(id);
  }

  @Post('events/:id/config')
  @ApiOperation({ summary: 'Mettre à jour la configuration d un événement' })
  async updateConfig(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateEventConfig(id, data);
  }

  @Post('events/:id/guests')
  @ApiOperation({ summary: 'Ajouter un invité à un événement' })
  @ApiResponse({ status: 201, description: 'Invité créé avec succès' })
  async addGuest(@Param('id') id: string, @Body() guestData: CreateGuestDto) {
    return this.adminService.addGuest(id, guestData);
  }
}
