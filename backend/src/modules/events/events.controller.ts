import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EventsService } from './events.service';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('Events')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les événements' })
  async findAll(@Query('organizationId') organizationId?: string) {
    return this.eventsService.findAll(organizationId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un événement' })
  @ApiResponse({ status: 201, description: 'Événement créé avec succès' })
  async create(@Body() dto: CreateEventDto) {
    // In a real scenario, we'd get organizationId and createdById from the request user
    return this.eventsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un événement par ID' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un événement' })
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un événement' })
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  // EVENT SETUP
  @Get(':id/setup/status')
  @ApiOperation({ summary: 'Récupérer le statut du wizard de configuration' })
  async setupStatus(@Param('id') id: string) {
    return { currentStep: 1 };
  }

  @Post(':id/setup/step/:stepId')
  @ApiOperation({ summary: 'Enregistrer une étape du wizard (1-5)' })
  async setupStep(@Param('id') id: string, @Param('stepId') stepId: string, @Body() dto: any) {
    return { success: true };
  }

  @Post(':id/setup/finalize')
  @ApiOperation({ summary: 'Finaliser la configuration initiale' })
  async setupFinalize(@Param('id') id: string) {
    return { success: true };
  }

  // EVENT SETTINGS
  @Get(':id/settings')
  @ApiOperation({ summary: 'Récupérer les réglages de l événement' })
  async getSettings(@Param('id') id: string) {
    return {};
  }

  @Put(':id/settings')
  @ApiOperation({ summary: 'Modifier les réglages de l événement' })
  async updateSettings(@Param('id') id: string, @Body() dto: any) {
    return { success: true };
  }

  // EVENT MODULES
  @Get(':id/modules')
  @ApiOperation({ summary: 'Lister les modules activés' })
  async getModules(@Param('id') id: string) {
    return [];
  }

  @Put(':id/modules')
  @ApiOperation({ summary: 'Activer/Désactiver des modules' })
  async updateModules(@Param('id') id: string, @Body() body: { modules: string[] }) {
    return { success: true };
  }

  // EVENT WORKFLOW
  @Get(':id/workflow')
  @ApiOperation({ summary: 'Récupérer le statut du workflow de validation' })
  async getWorkflow(@Param('id') id: string) {
    return { status: 'draft' };
  }

  @Post(':id/workflow/review')
  @ApiOperation({ summary: 'Soumettre pour revue' })
  async workflowReview(@Param('id') id: string) {
    return { success: true };
  }

  @Post(':id/workflow/approve')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Approuver l événement (Super Admin)' })
  async workflowApprove(@Param('id') id: string) {
    return { success: true };
  }

  @Post(':id/workflow/publish')
  @ApiOperation({ summary: 'Publier l événement' })
  async workflowPublish(@Param('id') id: string) {
    return { success: true };
  }

  @Post(':id/workflow/archive')
  @ApiOperation({ summary: 'Archiver l événement' })
  async workflowArchive(@Param('id') id: string) {
    return { success: true };
  }

  // PUBLISHING
  @Post(':id/publish')
  @ApiOperation({ summary: 'Publier' })
  async publish(@Param('id') id: string) {
    return { success: true };
  }

  @Post(':id/unpublish')
  @ApiOperation({ summary: 'Dépublier' })
  async unpublish(@Param('id') id: string) {
    return { success: true };
  }
}
