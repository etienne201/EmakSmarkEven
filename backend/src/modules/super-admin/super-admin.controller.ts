import { Controller, Get, Patch, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super Admin')
export class SuperAdminController {
  constructor(private superAdminService: SuperAdminService) {}

  @Get('stats')
  async getStats() {
    return this.superAdminService.getPlatformStats();
  }

  @Get('admins')
  async getAdmins() {
    return this.superAdminService.getAllAdmins();
  }

  @Patch('organizations/:id/block')
  async blockOrg(@Param('id') id: string) {
    return this.superAdminService.blockOrganization(id);
  }

  @Get('logs')
  async getLogs() {
    return this.superAdminService.getAllSystemLogs();
  }

  @Post('admins')
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.superAdminService.createAdminAccount(dto);
  }
}
