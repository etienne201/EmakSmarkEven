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
    const completedSteps = meta.completedSteps ?? [];

    return {
      eventId: event.id,
      currentStep: event.currentStep,
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

    // Étapes 1 & 2 bloquantes : on vérifie que les champs requis sont présents.
    const errors: string[] = [];
    if (!event.title || !event.slug || !event.eventType) {
      errors.push("Étape 1 incomplète : titre, slug et type d'événement sont requis.");
    }
    if (!event.startDate) {
      errors.push('Étape 2 incomplète : la date de début est requise.');
    }
    if (event.endDate && event.startDate && event.endDate <= event.startDate) {
      errors.push('La date de fin doit être postérieure à la date de début.');
    }
    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Finalisation impossible.', errors });
    }

    const meta = (event.metadata as SetupMetadata) ?? {};
    const completedSteps = Array.from(new Set([...(meta.completedSteps ?? []), 6]));

    await this.prisma.event.update({
      where: { id },
      data: {
        setupCompleted: true,
        currentStep: 6,
        metadata: { ...meta, completedSteps } as Prisma.InputJsonValue,
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
      await this.prisma.event.update({
        where: { id },
        data: {
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          eventType: dto.eventType,
          language: dto.language,
          visibility: dto.visibility,
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
    const nextStep = Math.min(Math.max(step + 1, ...completedSteps) || step, 6);
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
