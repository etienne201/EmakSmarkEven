import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Guests & Attendance')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckinController {

  @Post('checkins')
  @ApiOperation({ summary: 'Effectuer un check-in' })
  async checkin(@Body() body: { guestId: string }) {
    return { success: true };
  }

  @Get('events/:id/checkins')
  @ApiOperation({ summary: 'Lister les check-ins d un événement' })
  async findAll(@Param('id') id: string) {
    return [];
  }

  @Get('checkins/live')
  @ApiOperation({ summary: 'Flux en direct des check-ins' })
  async live() {
    return [];
  }
}
