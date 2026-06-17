import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EventsService } from './events.service';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventSettingsDto, UpdateEventModulesDto } from './dto/event-setup.dto';

interface AuthUser {
  id: string;
  organizationId?: string | null;
}

@ApiTags('Events')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @Permissions('events.list')
  @ApiOperation({ summary: 'Lister tous les événements' })
  async findAll(
    @Query('organizationId') organizationId?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    // Un admin ne voit que les événements de son organisation
    const orgId = organizationId || user?.organizationId || undefined;
    return this.eventsService.findAll(orgId);
  }

  @Post()
  @Permissions('events.create')
  @ApiOperation({ summary: 'Créer un événement' })
  @ApiResponse({ status: 201, description: 'Événement créé avec succès' })
  async create(@Body() dto: CreateEventDto, @CurrentUser() user: AuthUser) {
    return this.eventsService.create(dto, user);
  }

  @Get(':id')
  @Permissions('events.list')
  @ApiOperation({ summary: 'Récupérer un événement par ID' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  @Permissions('events.update')
  @ApiOperation({ summary: 'Modifier un événement' })
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('events.delete')
  @ApiOperation({ summary: 'Supprimer un événement' })
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  // ===================== EVENT SETUP =====================
  @Get(':id/setup/status')
  @ApiOperation({ summary: 'Récupérer le statut du wizard de configuration' })
  async setupStatus(@Param('id') id: string) {
    return this.eventsService.getSetupStatus(id);
  }

  @Post(':id/setup/step/:stepId')
  @Permissions('events.settings')
  @ApiOperation({ summary: 'Enregistrer une étape du wizard (1-5)' })
  async setupStep(
    @Param('id') id: string,
    @Param('stepId', ParseIntPipe) stepId: number,
    @Body() body: Record<string, unknown>,
  ) {
    return this.eventsService.saveStep(id, stepId, body);
  }

  @Post(':id/setup/finalize')
  @Permissions('events.settings')
  @ApiOperation({ summary: 'Finaliser la configuration initiale' })
  async setupFinalize(@Param('id') id: string) {
    return this.eventsService.finalizeSetup(id);
  }

  // ===================== EVENT SETTINGS =====================
  @Get(':id/settings')
  @ApiOperation({ summary: "Récupérer les réglages de l'événement" })
  async getSettings(@Param('id') id: string) {
    return this.eventsService.getSettings(id);
  }

  @Put(':id/settings')
  @Permissions('events.settings')
  @ApiOperation({ summary: "Modifier les réglages de l'événement" })
  async updateSettings(@Param('id') id: string, @Body() dto: UpdateEventSettingsDto) {
    return this.eventsService.updateSettings(id, dto);
  }

  // ===================== EVENT MODULES =====================
  @Get(':id/modules')
  @ApiOperation({ summary: 'Lister les modules activés' })
  async getModules(@Param('id') id: string) {
    return this.eventsService.getModules(id);
  }

  @Put(':id/modules')
  @Permissions('events.settings')
  @ApiOperation({ summary: 'Activer/Désactiver des modules (contraintes appliquées)' })
  async updateModules(@Param('id') id: string, @Body() body: UpdateEventModulesDto) {
    return this.eventsService.updateModules(id, body.modules);
  }

  // ===================== EVENT WORKFLOW =====================
  @Get(':id/workflow')
  @ApiOperation({ summary: 'Récupérer le statut du workflow de validation' })
  async getWorkflow(@Param('id') id: string) {
    return this.eventsService.getWorkflow(id);
  }

  @Post(':id/workflow/review')
  @Permissions('events.workflow')
  @ApiOperation({ summary: 'Soumettre pour revue' })
  async workflowReview(@Param('id') id: string) {
    return this.eventsService.submitForReview(id);
  }

  @Post(':id/workflow/approve')
  @Roles('Super Admin')
  @ApiOperation({ summary: "Approuver l'événement (Super Admin)" })
  async workflowApprove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.eventsService.approve(id, user.id);
  }

  @Post(':id/workflow/publish')
  @Permissions('events.publish')
  @ApiOperation({ summary: "Publier l'événement" })
  async workflowPublish(@Param('id') id: string) {
    return this.eventsService.publish(id);
  }

  @Post(':id/workflow/archive')
  @Permissions('events.workflow')
  @ApiOperation({ summary: "Archiver l'événement" })
  async workflowArchive(@Param('id') id: string) {
    return this.eventsService.archive(id);
  }

  // ===================== PUBLISHING =====================
  @Post(':id/publish')
  @Permissions('events.publish')
  @ApiOperation({ summary: 'Publier' })
  async publish(@Param('id') id: string) {
    return this.eventsService.publish(id);
  }

  @Post(':id/unpublish')
  @Permissions('events.publish')
  @ApiOperation({ summary: 'Dépublier' })
  async unpublish(@Param('id') id: string) {
    return this.eventsService.unpublish(id);
  }
}
