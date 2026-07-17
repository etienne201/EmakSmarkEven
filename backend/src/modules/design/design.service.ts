import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDesignDto, UpdateDesignDto, CreateDesignExportDto } from './dto/design.dto';
import { DesignAssetCategory, EventTypeKey } from '@prisma/client';

@Injectable()
export class DesignService {
  constructor(private prisma: PrismaService) {}

  // ====================================================
  // THEMES
  // ====================================================
  async findEventThemes(eventId: string) {
    return this.prisma.eventTheme.findMany({
      where: { eventId },
      include: { sourceDesign: true },
    });
  }

  async findOneTheme(id: string) {
    return this.prisma.eventTheme.findUnique({
      where: { id },
      include: { sourceDesign: true },
    });
  }

  async createEventTheme(eventId: string, data: any) {
    return this.prisma.eventTheme.create({
      data: { ...data, eventId },
    });
  }

  async updateEventTheme(id: string, data: any) {
    return this.prisma.eventTheme.update({
      where: { id },
      data,
    });
  }

  async deleteEventTheme(id: string) {
    return this.prisma.eventTheme.delete({ where: { id } });
  }

  // ====================================================
  // LEGACY CONTENT/DESIGN LAYOUT
  // ====================================================
  async getEventDesign(eventId: string) {
    return this.prisma.eventContent.findUnique({
      where: { eventId },
    });
  }

  async updateEventDesign(eventId: string, data: any) {
    return this.prisma.eventContent.upsert({
      where: { eventId },
      update: data,
      create: { ...data, eventId },
    });
  }

  // ====================================================
  // DESIGNS (NEW ADVANCED DESIGN STUDIO)
  // ====================================================
  async findEventDesigns(eventId: string) {
    return this.prisma.design.findMany({
      where: { eventId },
      include: {
        baseTemplate: true,
        backgroundAsset: true,
        exports: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOneDesign(id: string) {
    const design = await this.prisma.design.findUnique({
      where: { id },
      include: {
        baseTemplate: true,
        backgroundAsset: true,
        exports: true,
        history: { orderBy: { version: 'desc' } },
        eventThemes: true,
      },
    });
    if (!design) {
      throw new NotFoundException(`Design introuvable (id: ${id}).`);
    }
    return design;
  }

  async createDesign(eventId: string, dto: CreateDesignDto) {
    return this.prisma.design.create({
      data: {
        eventId,
        name: dto.name ?? 'Sans titre',
        sourceType: dto.sourceType,
        canvasWidth: dto.canvasWidth ?? 1080,
        canvasHeight: dto.canvasHeight ?? 1440,
        layersData: dto.layersData as any,
        colorPalette: dto.colorPalette as any,
        backgroundAssetId: dto.backgroundAssetId,
        baseTemplateId: dto.baseTemplateId,
        aiPrompt: dto.aiPrompt,
        version: 1,
        status: 'draft',
      },
      include: {
        baseTemplate: true,
        backgroundAsset: true,
      },
    });
  }

  async updateDesign(id: string, dto: UpdateDesignDto) {
    const existing = await this.findOneDesign(id);

    // Si les données de calques (layersData) sont modifiées, on crée une version historique
    if (dto.layersData && JSON.stringify(dto.layersData) !== JSON.stringify(existing.layersData)) {
      // 1. Sauvegarde de la version actuelle dans l'historique
      await this.prisma.designVersion.create({
        data: {
          designId: id,
          layersData: existing.layersData as any,
          version: existing.version,
        },
      });

      // 2. Mise à jour avec incrément de la version
      return this.prisma.design.update({
        where: { id },
        data: {
          name: dto.name,
          canvasWidth: dto.canvasWidth,
          canvasHeight: dto.canvasHeight,
          layersData: dto.layersData as any,
          colorPalette: dto.colorPalette as any,
          backgroundAssetId: dto.backgroundAssetId,
          baseTemplateId: dto.baseTemplateId,
          sourceType: dto.sourceType,
          status: dto.status,
          version: existing.version + 1,
        },
        include: {
          baseTemplate: true,
          backgroundAsset: true,
        },
      });
    }

    // Sinon, mise à jour simple sans changer de version
    return this.prisma.design.update({
      where: { id },
      data: {
        name: dto.name,
        canvasWidth: dto.canvasWidth,
        canvasHeight: dto.canvasHeight,
        colorPalette: dto.colorPalette as any,
        backgroundAssetId: dto.backgroundAssetId,
        baseTemplateId: dto.baseTemplateId,
        sourceType: dto.sourceType,
        status: dto.status,
      },
      include: {
        baseTemplate: true,
        backgroundAsset: true,
      },
    });
  }

  async deleteDesign(id: string) {
    await this.findOneDesign(id);
    return this.prisma.design.delete({
      where: { id },
    });
  }

  // ====================================================
  // EXPORTS
  // ====================================================
  async createDesignExport(designId: string, dto: CreateDesignExportDto) {
    await this.findOneDesign(designId);
    return this.prisma.designExport.create({
      data: {
        designId,
        format: dto.format,
        url: dto.url,
        width: dto.width,
        height: dto.height,
      },
    });
  }

  async getDesignExports(designId: string) {
    await this.findOneDesign(designId);
    return this.prisma.designExport.findMany({
      where: { designId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ====================================================
  // VERSIONS / HISTORIQUE
  // ====================================================
  async getDesignVersions(designId: string) {
    await this.findOneDesign(designId);
    return this.prisma.designVersion.findMany({
      where: { designId },
      orderBy: { version: 'desc' },
    });
  }

  // ====================================================
  // TEMPLATES
  // ====================================================
  async getDesignTemplates(eventType?: EventTypeKey) {
    if (!eventType) {
      return this.prisma.designTemplate.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    const dedicated = await this.prisma.designTemplate.findMany({
      where: { eventType },
      orderBy: { createdAt: 'desc' },
    });
    if (dedicated.length > 0) {
      return dedicated;
    }

    // Fallback : modèles universels (other, festival, null)
    return this.prisma.designTemplate.findMany({
      where: {
        OR: [
          { eventType: 'other' },
          { eventType: 'festival' },
          { eventType: null },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ====================================================
  // ASSETS
  // ====================================================
  async getDesignAssets(category?: DesignAssetCategory) {
    return this.prisma.designAsset.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  // ====================================================
  // EVENT GALLERY ASSETS (LEGACY/COMPATIBILITY)
  // ====================================================
  async getAssets(eventId: string) {
    return this.prisma.eventAsset.findMany({
      where: { eventId },
    });
  }

  async createAsset(eventId: string, data: any) {
    return this.prisma.eventAsset.create({
      data: { ...data, eventId },
    });
  }
}
