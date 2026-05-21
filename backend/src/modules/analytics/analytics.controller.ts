import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics & Reports')
@Controller('events/:id/analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {

  @Get()
  @ApiOperation({ summary: 'Résumé analytique global' })
  async getSummary(@Param('id') id: string) {
    return { views: 0, checkins: 0 };
  }

  @Get('views')
  @ApiOperation({ summary: 'Statistiques des vues' })
  async getViews(@Param('id') id: string) {
    return [];
  }

  @Get('checkins')
  @ApiOperation({ summary: 'Statistiques des check-ins' })
  async getCheckins(@Param('id') id: string) {
    return [];
  }

  @Get('engagement')
  @ApiOperation({ summary: 'Statistiques d engagement' })
  async getEngagement(@Param('id') id: string) {
    return [];
  }

  @Get('guests')
  @ApiOperation({ summary: 'Analyses démographiques des invités' })
  async getGuests(@Param('id') id: string) {
    return [];
  }
}
