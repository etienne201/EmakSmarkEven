import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Prisma, EventStatus, WorkflowStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  SETUP_STEP_DTOS,
  SetupStep1Dto,
  SetupStep2Dto,
  SetupStep3Dto,
  SetupStep4Dto,
  SetupStep5Dto,
  SetupModulesDto,
  UpdateEventSettingsDto,
} from './dto/event-setup.dto';

/** Clés de modules connues + leurs dépendances (cf. cahier des charges). */
const MODULE_KEYS = [
  'guests',
  'invitations',
  'qrCheckin',
  'tables',
  'seating',
  'analytics',
  'badges',
  'notifications',
] as const;
type ModuleKey = (typeof MODULE_KEYS)[number];

interface SetupMetadata {
  completedSteps?: number[];
  access?: Record<string, unknown>;
  [key: string]: unknown;
}

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  // ====================================================
  // CRUD
  // ====================================================
  async findAll(organizationId?: string) {
    return this.prisma.event.findMany({
      where: organizationId ? { organizationId } : {},
      include: { settings: true, modules: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        settings: true,
        modules: true,
        themes: true,
        workflow: true,
        sessions: true,
        sponsors: true,
      },
    });
    if (!event) {
      throw new NotFoundException(`Événement introuvable (id: ${id}).`);
    }
    return event;
  }

  async create(dto: CreateEventDto, user: { id: string; organizationId?: string | null }) {
    const organizationId = dto.organizationId ?? user.organizationId;
    if (!organizationId) {
      throw new BadRequestException(
        "Aucune organisation associée. L'utilisateur doit appartenir à une organisation ou fournir organizationId.",
      );
    }

    try {
      return await this.prisma.event.create({
        data: {
          organizationId,
          createdById: user.id,
          ownerId: user.id,
          title: dto.title,
          slug: dto.slug,
          eventType: dto.eventType,
          startDate: new Date(dto.startDate),
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          description: dto.description,
          visibility: dto.visibility,
          language: dto.language ?? 'fr',
          location: dto.location,
          city: dto.city,
          country: dto.country,
          currentStep: 1,
          setupCompleted: false,
        },
      });
    } catch (e) {
      throw this.mapPrismaError(e);
    }
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.ensureExists(id);
    try {
      return await this.prisma.event.update({
        where: { id },
        data: {
          ...dto,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        },
      });
    } catch (e) {
      throw this.mapPrismaError(e);
    }
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.event.delete({ where: { id } });
    return { success: true };
  }

  // ====================================================
  // SETUP WIZARD
  // ====================================================
  async getSetupStatus(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { settings: true, modules: true, themes: true },
    });
    if (!event) {
      throw new NotFoundException(`Événement introuvable (id: ${id}).`);
    }

    const meta = (event.metadata as SetupMetadata) ?? {};
    const backendCompletedSteps = meta.completedSteps ?? [];

    const completedSteps: number[] = [];
    
    // Étape 1 : Infos de base (nécessite les étapes backend 1 et 2 complétées)
    const hasStep1 = event.title && event.title.trim().length >= 3 && event.slug && event.eventType;
    const hasStep2 = event.startDate;
    if (hasStep1 && hasStep2 && backendCompletedSteps.includes(1) && backendCompletedSteps.includes(2)) {
      completedSteps.push(1);
    }
    
    // Étape 2 : Modules (nécessite l'étape backend 3 complétée)
    if (backendCompletedSteps.includes(3)) {
      completedSteps.push(2);
    }
    
    // Étape 3 et 4 : Templates & Éditeur (nécessite l'existence d'au moins un design)
    const designsCount = await this.prisma.design.count({
      where: { eventId: id },
    });
    if (designsCount > 0) {
      completedSteps.push(3);
      completedSteps.push(4);
    }
    
    // Étape 5 : Branding (nécessite l'étape backend 4 complétée)
    if (backendCompletedSteps.includes(4)) {
      completedSteps.push(5);
    }
    
    // Étape 6 : Contenu (nécessite description non vide)
    if (event.description && event.description.trim().length > 0) {
      completedSteps.push(6);
    }
    
    // Étape 7 : Invités (nécessite l'étape backend 5 complétée)
    if (backendCompletedSteps.includes(5)) {
      completedSteps.push(7);
    }
    
    // Étape 8 : Revue (nécessite la finalisation)
    if (event.setupCompleted) {
      completedSteps.push(8);
    }
    
    // Étape 9 : Publication (nécessite un statut publié)
    if (event.status !== 'draft') {
      completedSteps.push(9);
    }
    
    // Calcul de l'étape courante
    let currentStep = 1;
    for (let step = 1; step <= 9; step++) {
      if (!completedSteps.includes(step)) {
        currentStep = step;
        break;
      }
    }
    if (completedSteps.length === 9 || event.setupCompleted) {
      currentStep = 9;
    }

    return {
      eventId: event.id,
      currentStep,
      completedSteps,
      setupCompleted: event.setupCompleted,
      status: event.status,
      steps: {
        1: {
          title: event.title,
          slug: event.slug,
          description: event.description,
          eventType: event.eventType,
          language: event.language,
          visibility: event.visibility,
          agenda: (meta.agenda as string) ?? "",
          extraText: (meta.extraText as string) ?? "",
        },
        2: {
          location: event.location,
          city: event.city,
          country: event.country,
          timezone: event.timezone,
          startDate: event.startDate,
          endDate: event.endDate,
        },
        3: { modules: this.modulesToMap(event.modules), settings: event.settings },
        4: { themes: event.themes },
        5: { access: meta.access ?? null },
      },
    };
  }

  /** Valide dynamiquement le body selon l'étape, persiste, et met à jour la progression. */
  async saveStep(id: string, stepNumber: number, body: unknown) {
    const event = await this.ensureExists(id);

    if (!(stepNumber in SETUP_STEP_DTOS)) {
      throw new BadRequestException(`Étape invalide: ${stepNumber} (attendu 1 à 5).`);
    }
    const dtoClass = SETUP_STEP_DTOS[stepNumber as keyof typeof SETUP_STEP_DTOS];
    const dto = await this.validateDto(dtoClass as new () => object, body);

    switch (stepNumber) {
      case 1:
        await this.persistStep1(id, dto as unknown as SetupStep1Dto);
        break;
      case 2:
        await this.persistStep2(id, dto as unknown as SetupStep2Dto);
        break;
      case 3:
        await this.persistStep3(id, (dto as unknown as SetupStep3Dto).modules);
        break;
      case 4:
        await this.persistStep4(id, dto as unknown as SetupStep4Dto);
        break;
      case 5:
        await this.persistStep5(id, dto as unknown as SetupStep5Dto);
        break;
    }

    await this.markStepCompleted(id, event.metadata as SetupMetadata, stepNumber);
    return this.getSetupStatus(id);
  }

  async finalizeSetup(id: string) {
    const event = await this.ensureExists(id);

    // Validation des étapes obligatoires (1 & 2) et cohérence des données
    const errors: string[] = [];
    
    // Étape 1 - Informations générales
    if (!event.title || event.title.trim().length < 3) {
      errors.push("Étape 1 incomplète : le titre doit contenir au moins 3 caractères.");
    }
    if (!event.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug)) {
      errors.push("Étape 1 incomplète : le slug est invalide (minuscules, chiffres et tirets uniquement).");
    }
    if (!event.eventType) {
      errors.push("Étape 1 incomplète : le type d'événement est requis.");
    }

    // Étape 2 - Lieu & dates
    if (!event.startDate) {
      errors.push('Étape 2 incomplète : la date de début est requise.');
    } else if (new Date(event.startDate) < new Date()) {
      errors.push('Étape 2 invalide : la date de début ne peut pas être dans le passé.');
    }
    if (event.endDate && event.startDate && new Date(event.endDate) <= new Date(event.startDate)) {
      errors.push('Étape 2 invalide : la date de fin doit être postérieure à la date de début.');
    }

    // Vérifier que les étapes 1 et 2 sont marquées comme complétées
    const meta = (event.metadata as SetupMetadata) ?? {};
    const completedSteps = meta.completedSteps ?? [];
    if (!completedSteps.includes(1)) {
      errors.push("L'étape 1 doit être validée avant la finalisation.");
    }
    if (!completedSteps.includes(2)) {
      errors.push("L'étape 2 doit être validée avant la finalisation.");
    }

    if (errors.length > 0) {
      throw new BadRequestException({ 
        message: 'Finalisation impossible. Veuillez compléter les étapes requises.', 
        errors 
      });
    }

    // Marquer le setup comme complété
    const finalCompletedSteps = Array.from(new Set([...completedSteps, 5])); // 5 = étape finale

    await this.prisma.event.update({
      where: { id },
      data: {
        setupCompleted: true,
        currentStep: 9,
        status: EventStatus.draft, // L'événement reste en draft jusqu'à publication explicite
        metadata: { ...meta, completedSteps: finalCompletedSteps } as Prisma.InputJsonValue,
      },
    });

    return { success: true, ...(await this.getSetupStatus(id)) };
  }

  // ====================================================
  // SETTINGS
  // ====================================================
  async getSettings(id: string) {
    await this.ensureExists(id);
    const settings = await this.prisma.eventSettings.findUnique({ where: { eventId: id } });
    return settings ?? this.defaultSettings(id);
  }

  async updateSettings(id: string, dto: UpdateEventSettingsDto) {
    await this.ensureExists(id);
    const { customRules, ...rest } = dto;
    const data = {
      ...rest,
      ...(customRules !== undefined
        ? { customRules: customRules as Prisma.InputJsonValue }
        : {}),
    };
    return this.prisma.eventSettings.upsert({
      where: { eventId: id },
      update: data,
      create: { eventId: id, ...data },
    });
  }

  // ====================================================
  // MODULES
  // ====================================================
  async getModules(id: string) {
    await this.ensureExists(id);
    const modules = await this.prisma.eventModule.findMany({ where: { eventId: id } });
    return this.modulesToMap(modules);
  }

  async updateModules(id: string, modules: SetupModulesDto) {
    await this.ensureExists(id);
    return this.persistStep3(id, modules);
  }

  // ====================================================
  // WORKFLOW
  // ====================================================
  async getWorkflow(id: string) {
    await this.ensureExists(id);
    const workflow = await this.prisma.eventWorkflow.findUnique({ where: { eventId: id } });
    return workflow ?? { eventId: id, status: WorkflowStatus.draft };
  }

  async submitForReview(id: string) {
    return this.transitionWorkflow(id, WorkflowStatus.review, EventStatus.review);
  }

  async approve(id: string, approvedById: string) {
    const wf = await this.upsertWorkflow(id, WorkflowStatus.approved, { approvedById });
    return wf;
  }

  async publish(id: string) {
    await this.ensureExists(id);
    const now = new Date();
    const [, , publish] = await this.prisma.$transaction([
      this.prisma.event.update({ where: { id }, data: { status: EventStatus.published } }),
      this.prisma.eventWorkflow.upsert({
        where: { eventId: id },
        update: { status: WorkflowStatus.published, publishedAt: now },
        create: { eventId: id, status: WorkflowStatus.published, publishedAt: now },
      }),
      this.prisma.eventPublish.upsert({
        where: { eventId: id },
        update: { publishedAt: now, unpublishedAt: null },
        create: { eventId: id, publishedAt: now },
      }),
    ]);
    return publish;
  }

  async unpublish(id: string) {
    await this.ensureExists(id);
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.event.update({ where: { id }, data: { status: EventStatus.draft } }),
      this.prisma.eventPublish.updateMany({ where: { eventId: id }, data: { unpublishedAt: now } }),
    ]);
    return { success: true };
  }

  async archive(id: string) {
    return this.transitionWorkflow(id, WorkflowStatus.archived, EventStatus.archived);
  }

  // ====================================================
  // HELPERS — persistance par étape
  // ====================================================
  private async persistStep1(id: string, dto: SetupStep1Dto) {
    try {
      const event = await this.prisma.event.findUnique({ where: { id }, select: { metadata: true } });
      const meta = (event?.metadata as SetupMetadata) ?? {};
      await this.prisma.event.update({
        where: { id },
        data: {
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          eventType: dto.eventType,
          language: dto.language,
          visibility: dto.visibility,
          metadata: {
            ...meta,
            agenda: dto.agenda ?? null,
            extraText: dto.extraText ?? null,
          } as Prisma.InputJsonValue,
        },
      });
    } catch (e) {
      throw this.mapPrismaError(e);
    }
  }

  private async persistStep2(id: string, dto: SetupStep2Dto) {
    const start = new Date(dto.startDate);
    const end = dto.endDate ? new Date(dto.endDate) : null;
    if (end && end <= start) {
      throw new BadRequestException('La date de fin doit être postérieure à la date de début.');
    }
    await this.prisma.event.update({
      where: { id },
      data: {
        location: dto.location,
        city: dto.city,
        country: dto.country,
        timezone: dto.timezone,
        startDate: start,
        endDate: end,
      },
    });
  }

  /** Applique les contraintes métier puis upsert chaque module + synchronise les réglages. */
  private async persistStep3(id: string, input: SetupModulesDto) {
    const resolved = this.applyModuleConstraints(input);

    const ops: Prisma.PrismaPromise<unknown>[] = MODULE_KEYS.map((key) =>
      this.prisma.eventModule.upsert({
        where: { eventId_moduleKey: { eventId: id, moduleKey: key } },
        update: { enabled: resolved[key] },
        create: { eventId: id, moduleKey: key, enabled: resolved[key] },
      }),
    );

    // Synchronise les booléens dérivés dans EventSettings.
    ops.push(
      this.prisma.eventSettings.upsert({
        where: { eventId: id },
        update: {
          qrEnabled: resolved.qrCheckin,
          checkinEnabled: resolved.qrCheckin,
          networkingEnabled: resolved.seating,
        },
        create: {
          eventId: id,
          qrEnabled: resolved.qrCheckin,
          checkinEnabled: resolved.qrCheckin,
          networkingEnabled: resolved.seating,
        },
      }),
    );

    await this.prisma.$transaction(ops);
    return { modules: resolved };
  }

  private async persistStep4(id: string, dto: SetupStep4Dto) {
    const tokens = {
      colors: dto.colors ?? {},
      typography: dto.typography ?? {},
      logoUrl: dto.logoUrl ?? null,
      bannerUrl: dto.bannerUrl ?? null,
    } as Prisma.InputJsonValue;

    const existing = await this.prisma.eventTheme.findFirst({ where: { eventId: id } });
    if (existing) {
      return this.prisma.eventTheme.update({
        where: { id: existing.id },
        data: { name: dto.theme ?? existing.name, tokens },
      });
    }
    return this.prisma.eventTheme.create({
      data: { eventId: id, name: dto.theme ?? 'default', tokens },
    });
  }

  private async persistStep5(id: string, dto: SetupStep5Dto) {
    const event = await this.prisma.event.findUnique({ where: { id }, select: { metadata: true } });
    const meta = (event?.metadata as SetupMetadata) ?? {};
    await this.prisma.event.update({
      where: { id },
      data: {
        metadata: {
          ...meta,
          access: {
            guestCategories: dto.guestCategories ?? [],
            staffCategories: dto.staffCategories ?? [],
            permissions: dto.permissions ?? {},
            customAccess: dto.customAccess ?? {},
          },
        } as Prisma.InputJsonValue,
      },
    });
  }

  // ====================================================
  // HELPERS — divers
  // ====================================================
  /** guests toujours actif ; qrCheckin & tables nécessitent guests. */
  private applyModuleConstraints(input: SetupModulesDto): Record<ModuleKey, boolean> {
    const guests = true; // contrainte : toujours activé
    return {
      guests,
      invitations: input.invitations ?? false,
      qrCheckin: guests ? input.qrCheckin ?? false : false,
      tables: guests ? input.tables ?? false : false,
      seating: input.seating ?? false,
      analytics: input.analytics ?? false,
      badges: input.badges ?? false,
      notifications: input.notifications ?? false,
    };
  }

  private modulesToMap(modules: { moduleKey: string; enabled: boolean }[]): Record<string, boolean> {
    const map: Record<string, boolean> = {};
    for (const key of MODULE_KEYS) map[key] = key === 'guests';
    for (const m of modules) map[m.moduleKey] = m.enabled;
    return map;
  }

  private async markStepCompleted(id: string, currentMeta: SetupMetadata | null, step: number) {
    const meta = currentMeta ?? {};
    const completedSteps = Array.from(new Set([...(meta.completedSteps ?? []), step]));
    const nextStep = Math.min(Math.max(step + 1, ...completedSteps) || step, 9);
    await this.prisma.event.update({
      where: { id },
      data: {
        currentStep: nextStep,
        metadata: { ...meta, completedSteps } as Prisma.InputJsonValue,
      },
    });
  }

  private defaultSettings(eventId: string) {
    return {
      eventId,
      rsvpEnabled: true,
      qrEnabled: true,
      checkinEnabled: true,
      networkingEnabled: false,
      livestreamEnabled: false,
      guestLimit: null,
      customRules: null,
    };
  }

  private async transitionWorkflow(id: string, wf: WorkflowStatus, ev: EventStatus) {
    await this.ensureExists(id);
    await this.prisma.$transaction([
      this.prisma.event.update({ where: { id }, data: { status: ev } }),
      this.prisma.eventWorkflow.upsert({
        where: { eventId: id },
        update: { status: wf },
        create: { eventId: id, status: wf },
      }),
    ]);
    return this.getWorkflow(id);
  }

  private async upsertWorkflow(id: string, status: WorkflowStatus, extra: Record<string, unknown> = {}) {
    await this.ensureExists(id);
    return this.prisma.eventWorkflow.upsert({
      where: { eventId: id },
      update: { status, ...extra },
      create: { eventId: id, status, ...extra },
    });
  }

  private async ensureExists(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Événement introuvable (id: ${id}).`);
    }
    return event;
  }

  private async validateDto<T extends object>(
    cls: new () => T,
    body: unknown,
  ): Promise<T> {
    const instance = plainToInstance(cls, body ?? {}, { enableImplicitConversion: true });
    const validationErrors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });
    if (validationErrors.length > 0) {
      const messages = validationErrors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      throw new BadRequestException({ message: 'Validation échouée.', errors: messages });
    }
    return instance;
  }

  private mapPrismaError(e: unknown): Error {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        const target = (e.meta?.target as string[])?.join(', ') ?? 'champ unique';
        return new ConflictException(`Valeur déjà utilisée (${target}). Le slug doit être unique.`);
      }
      if (e.code === 'P2025') {
        return new NotFoundException('Ressource introuvable.');
      }
    }
    return e as Error;
  }
}
