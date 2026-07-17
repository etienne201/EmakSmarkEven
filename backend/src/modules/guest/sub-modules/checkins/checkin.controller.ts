import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GuestService } from '../../guest.service';

@ApiTags('Guests & Attendance')
@Controller()
export class CheckinController {
  constructor(private readonly guestService: GuestService) {}

  @Post('checkins')
  @ApiOperation({ summary: 'Effectuer un check-in' })
  async checkin(@Body() body: { guestId: string; status?: string }) {
    return this.guestService.createCheckin(body.guestId, body.status);
  }

  @Get('events/:id/checkins')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les check-ins d un événement' })
  async findAll(@Param('id') id: string) {
    return this.guestService.findCheckins(id);
  }

  @Get('checkins/live')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Flux en direct des check-ins' })
  async live() {
    return [];
  }
}


