import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@ApiTags('Guests & Attendance')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GuestsController {
  constructor(private readonly guestService: GuestService) {}

  @Get('events/:id/guests')
  @ApiOperation({ summary: 'Lister les invités d un événement' })
  async findAll(@Param('id') id: string) {
    return this.guestService.findAll(id);
  }

  @Post('events/:id/guests')
  @ApiOperation({ summary: 'Ajouter un invité' })
  async create(@Param('id') id: string, @Body() dto: CreateGuestDto) {
    return this.guestService.create({ ...dto, eventId: id });
  }

  @Get('guests/:guestId')
  @ApiOperation({ summary: 'Récupérer un invité par ID' })
  async findOne(@Param('guestId') guestId: string) {
    return this.guestService.findOne(guestId);
  }

  @Put('guests/:guestId')
  @ApiOperation({ summary: 'Modifier un invité' })
  async update(@Param('guestId') guestId: string, @Body() dto: UpdateGuestDto) {
    return this.guestService.update(guestId, dto);
  }

  @Delete('guests/:guestId')
  @ApiOperation({ summary: 'Supprimer un invité' })
  async remove(@Param('guestId') guestId: string) {
    return this.guestService.remove(guestId);
  }

  @Post('events/:id/guests/import')
  @ApiOperation({ summary: 'Importer des invités via CSV/Excel' })
  async importGuests(@Param('id') id: string, @Body() body: any) {
    return this.guestService.importGuests(id, body);
  }

  @Post('events/:id/guests/export')
  @ApiOperation({ summary: 'Exporter la liste des invités' })
  async exportGuests(@Param('id') id: string) {
    return this.guestService.exportGuests(id);
  }

  @Post('guests/:guestId/rsvp')
  @ApiOperation({ summary: 'Réponse RSVP (Public ou Admin)' })
  async rsvp(@Param('guestId') guestId: string, @Body() body: { status: string }) {
    return this.guestService.rsvp(guestId, body);
  }
}
