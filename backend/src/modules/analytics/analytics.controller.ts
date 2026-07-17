import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics & Reports')
@Controller('events/:id/analytics')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Résumé analytique global' })
  async getSummary(@Param('id') id: string) {
    return this.analyticsService.getSummary(id);
  }

  @Get('views')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Statistiques des vues' })
  async getViews(@Param('id') id: string) {
    return this.analyticsService.getViews(id);
  }

  @Get('checkins')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Statistiques des check-ins' })
  async getCheckins(@Param('id') id: string) {
    return this.analyticsService.getCheckins(id);
  }

  @Get('engagement')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Statistiques d engagement' })
  async getEngagement(@Param('id') id: string) {
    return this.analyticsService.getEngagement(id);
  }

  @Get('guests')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Analyses démographiques des invités' })
  async getGuests(@Param('id') id: string) {
    return this.analyticsService.getGuestsAnalysis(id);
  }
}

