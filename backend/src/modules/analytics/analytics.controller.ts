import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Analytics & Reports')
@Controller('events/:id/analytics')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AnalyticsController {

  @Get()
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Résumé analytique global' })
  async getSummary(@Param('id') id: string) {
    return { views: 0, checkins: 0 };
  }

  @Get('views')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Statistiques des vues' })
  async getViews(@Param('id') id: string) {
    return [];
  }

  @Get('checkins')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Statistiques des check-ins' })
  async getCheckins(@Param('id') id: string) {
    return [];
  }

  @Get('engagement')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Statistiques d engagement' })
  async getEngagement(@Param('id') id: string) {
    return [];
  }

  @Get('guests')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Analyses démographiques des invités' })
  async getGuests(@Param('id') id: string) {
    return [];
  }
}
