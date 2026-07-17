import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DesignService } from './design.service';
import { CreateDesignDto, UpdateDesignDto, CreateDesignExportDto } from './dto/design.dto';
import { DesignAssetCategory, EventTypeKey } from '@prisma/client';

@ApiTags('Design Studio')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DesignsController {
  constructor(private readonly designService: DesignService) {}

  @Get('events/:eventId/designs')
  @ApiOperation({ summary: 'Lister tous les designs d un événement' })
  async findEventDesigns(@Param('eventId') eventId: string) {
    return this.designService.findEventDesigns(eventId);
  }

  @Post('events/:eventId/designs')
  @ApiOperation({ summary: 'Créer un nouveau design pour un événement' })
  async createDesign(@Param('eventId') eventId: string, @Body() dto: CreateDesignDto) {
    return this.designService.createDesign(eventId, dto);
  }

  @Get('designs/:id')
  @ApiOperation({ summary: 'Récupérer un design par son ID' })
  async findOneDesign(@Param('id') id: string) {
    return this.designService.findOneDesign(id);
  }

  @Put('designs/:id')
  @ApiOperation({ summary: 'Mettre à jour un design par son ID (crée une nouvelle version historique si layersData change)' })
  async updateDesign(@Param('id') id: string, @Body() dto: UpdateDesignDto) {
    return this.designService.updateDesign(id, dto);
  }

  @Delete('designs/:id')
  @ApiOperation({ summary: 'Supprimer un design par son ID' })
  async deleteDesign(@Param('id') id: string) {
    return this.designService.deleteDesign(id);
  }

  @Post('designs/:id/exports')
  @ApiOperation({ summary: 'Enregistrer un export (PNG, JPEG, PDF) pour un design' })
  async createDesignExport(@Param('id') id: string, @Body() dto: CreateDesignExportDto) {
    return this.designService.createDesignExport(id, dto);
  }

  @Get('designs/:id/exports')
  @ApiOperation({ summary: 'Lister tous les exports d un design' })
  async getDesignExports(@Param('id') id: string) {
    return this.designService.getDesignExports(id);
  }

  @Get('designs/:id/versions')
  @ApiOperation({ summary: 'Lister l historique des versions d un design' })
  async getDesignVersions(@Param('id') id: string) {
    return this.designService.getDesignVersions(id);
  }

  @Get('design-templates')
  @ApiOperation({ summary: 'Récupérer la liste des modèles de design réutilisables' })
  @ApiQuery({ name: 'eventType', required: false, enum: EventTypeKey })
  async getDesignTemplates(@Query('eventType') eventType?: EventTypeKey) {
    return this.designService.getDesignTemplates(eventType);
  }

  @Get('design-assets')
  @ApiOperation({ summary: 'Récupérer la bibliothèque d assets (formes, stickers, icônes)' })
  @ApiQuery({ name: 'category', required: false, enum: DesignAssetCategory })
  async getDesignAssets(@Query('category') category?: DesignAssetCategory) {
    return this.designService.getDesignAssets(category);
  }
}
