import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { PlatformService } from './platform.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@ApiTags('Platform Admin')
@Controller('platform')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('settings')
  @ApiOperation({ summary: 'Récupérer les paramètres globaux' })
  async getSettings() {
    return this.platformService.getSettings();
  }

  @Post('settings')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Mettre à jour un paramètre' })
  async updateSetting(@Body() dto: UpdateSettingDto) {
    return this.platformService.updateSetting(dto.key, dto.value);
  }

  @Get('health')
  @ApiOperation({ summary: 'Santé du système' })
  async getHealth() {
    return this.platformService.getHealth();
  }

  @Get('templates')
  @ApiOperation({ summary: 'Lister les templates' })
  async findTemplates() {
    return this.platformService.findAllTemplates();
  }

  @Post('templates')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Créer un template (Super Admin)' })
  async createTemplate(@Body() dto: any) {
    return this.platformService.createTemplate(dto);
  }

  @Get('webhooks')
  @ApiOperation({ summary: 'Lister les webhooks' })
  async findWebhooks(@Query('organizationId') orgId: string) {
    return this.platformService.findAllWebhooks(orgId);
  }

  @Post('webhooks')
  @ApiOperation({ summary: 'Créer un webhook' })
  async createWebhook(@Query('organizationId') orgId: string, @Body() dto: any) {
    return this.platformService.createWebhook(orgId, dto);
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'Lister les clés API' })
  async findApiKeys(@Query('organizationId') orgId: string) {
    return this.platformService.findAllApiKeys(orgId);
  }

  @Post('api-keys')
  @ApiOperation({ summary: 'Générer une clé API' })
  async createApiKey(@Query('organizationId') orgId: string, @Body() body: { name: string }) {
    return this.platformService.createApiKey(orgId, body.name);
  }

  @Get('security/audit-logs')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Lister les logs d audit (Super Admin)' })
  async getAuditLogs() {
    return this.platformService.getAuditLogs();
  }

  @Get('security/login-history')
  @ApiOperation({ summary: 'Historique des connexions' })
  async getLoginHistory() {
    // This could also come from securityAuditLog with type LOGIN
    return this.platformService.getAuditLogs();
  }
}
