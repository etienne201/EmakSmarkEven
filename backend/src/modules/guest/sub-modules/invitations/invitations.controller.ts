import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Guests & Attendance')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvitationsController {

  @Post('events/:id/invitations/send')
  @ApiOperation({ summary: 'Envoyer une invitation unitaire' })
  async send(@Param('id') id: string, @Body() body: { guestId: string }) {
    return { success: true };
  }

  @Post('events/:id/invitations/send-bulk')
  @ApiOperation({ summary: 'Envoyer des invitations en masse' })
  async sendBulk(@Param('id') id: string, @Body() body: { guestIds: string[] }) {
    return { success: true };
  }

  @Get('invitations/:code')
  @ApiOperation({ summary: 'Récupérer les détails d une invitation via son code' })
  async findByCode(@Param('code') code: string) {
    return { code };
  }
}
