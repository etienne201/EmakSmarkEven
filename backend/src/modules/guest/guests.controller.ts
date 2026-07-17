import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@ApiTags('Guests & Attendance')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class GuestsController {
  constructor(private readonly guestService: GuestService) {}

  @Get('events/:id/guests')
  @Permissions('guests.list')
  @ApiOperation({ summary: 'Lister les invités d un événement' })
  async findAll(@Param('id') id: string) {
    return this.guestService.findAll(id);
  }

  @Post('events/:id/guests')
  @Permissions('guests.create')
  @ApiOperation({ summary: 'Ajouter un invité' })
  async create(@Param('id') id: string, @Body() dto: CreateGuestDto) {
    return this.guestService.create({ ...dto, eventId: id });
  }

  @Get('guests/:guestId')
  @Permissions('guests.list')
  @ApiOperation({ summary: 'Récupérer un invité par ID' })
  async findOne(@Param('guestId') guestId: string) {
    return this.guestService.findOne(guestId);
  }

  @Put('guests/:guestId')
  @Permissions('guests.update')
  @ApiOperation({ summary: 'Modifier un invité' })
  async update(@Param('guestId') guestId: string, @Body() dto: UpdateGuestDto) {
    return this.guestService.update(guestId, dto);
  }

  @Delete('guests/:guestId')
  @Permissions('guests.delete')
  @ApiOperation({ summary: 'Supprimer un invité' })
  async remove(@Param('guestId') guestId: string) {
    return this.guestService.remove(guestId);
  }

  @Post('events/:id/guests/import')
  @Permissions('guests.import')
  @ApiOperation({ summary: 'Importer des invités via CSV/Excel' })
  async importGuests(@Param('id') id: string, @Body() body: any) {
    return this.guestService.importGuests(id, body);
  }

  @Post('events/:id/guests/export')
  @Permissions('guests.list')
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
