"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
const event_setup_dto_1 = require("./dto/event-setup.dto");
const MODULE_KEYS = [
    'guests',
    'invitations',
    'qrCheckin',
    'tables',
    'seating',
    'analytics',
    'badges',
    'notifications',
];
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(organizationId) {
        return this.prisma.event.findMany({
            where: organizationId ? { organizationId } : {},
            include: { settings: true, modules: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Événement introuvable (id: ${id}).`);
        }
        return event;
    }
    async create(dto, user) {
        const organizationId = dto.organizationId ?? user.organizationId;
        if (!organizationId) {
            throw new common_1.BadRequestException("Aucune organisation associée. L'utilisateur doit appartenir à une organisation ou fournir organizationId.");
        }
        try {
            return await this.prisma.event.create({
                data: {
                    organizationId,
                    createdById: user.id,
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
        }
        catch (e) {
            throw this.mapPrismaError(e);
        }
    }
    async update(id, dto) {
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
        }
        catch (e) {
            throw this.mapPrismaError(e);
        }
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.event.delete({ where: { id } });
        return { success: true };
    }
    async getSetupStatus(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: { settings: true, modules: true, themes: true },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Événement introuvable (id: ${id}).`);
        }
        const meta = event.metadata ?? {};
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
    async saveStep(id, stepNumber, body) {
        const event = await this.ensureExists(id);
        if (!(stepNumber in event_setup_dto_1.SETUP_STEP_DTOS)) {
            throw new common_1.BadRequestException(`Étape invalide: ${stepNumber} (attendu 1 à 5).`);
        }
        const dtoClass = event_setup_dto_1.SETUP_STEP_DTOS[stepNumber];
        const dto = await this.validateDto(dtoClass, body);
        switch (stepNumber) {
            case 1:
                await this.persistStep1(id, dto);
                break;
            case 2:
                await this.persistStep2(id, dto);
                break;
            case 3:
                await this.persistStep3(id, dto.modules);
                break;
            case 4:
                await this.persistStep4(id, dto);
                break;
            case 5:
                await this.persistStep5(id, dto);
                break;
        }
        await this.markStepCompleted(id, event.metadata, stepNumber);
        return this.getSetupStatus(id);
    }
    async finalizeSetup(id) {
        const event = await this.ensureExists(id);
        const errors = [];
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
            throw new common_1.BadRequestException({ message: 'Finalisation impossible.', errors });
        }
        const meta = event.metadata ?? {};
        const completedSteps = Array.from(new Set([...(meta.completedSteps ?? []), 6]));
        await this.prisma.event.update({
            where: { id },
            data: {
                setupCompleted: true,
                currentStep: 6,
                metadata: { ...meta, completedSteps },
            },
        });
        return { success: true, ...(await this.getSetupStatus(id)) };
    }
    async getSettings(id) {
        await this.ensureExists(id);
        const settings = await this.prisma.eventSettings.findUnique({ where: { eventId: id } });
        return settings ?? this.defaultSettings(id);
    }
    async updateSettings(id, dto) {
        await this.ensureExists(id);
        const { customRules, ...rest } = dto;
        const data = {
            ...rest,
            ...(customRules !== undefined
                ? { customRules: customRules }
                : {}),
        };
        return this.prisma.eventSettings.upsert({
            where: { eventId: id },
            update: data,
            create: { eventId: id, ...data },
        });
    }
    async getModules(id) {
        await this.ensureExists(id);
        const modules = await this.prisma.eventModule.findMany({ where: { eventId: id } });
        return this.modulesToMap(modules);
    }
    async updateModules(id, modules) {
        await this.ensureExists(id);
        return this.persistStep3(id, modules);
    }
    async getWorkflow(id) {
        await this.ensureExists(id);
        const workflow = await this.prisma.eventWorkflow.findUnique({ where: { eventId: id } });
        return workflow ?? { eventId: id, status: client_1.WorkflowStatus.draft };
    }
    async submitForReview(id) {
        return this.transitionWorkflow(id, client_1.WorkflowStatus.review, client_1.EventStatus.review);
    }
    async approve(id, approvedById) {
        const wf = await this.upsertWorkflow(id, client_1.WorkflowStatus.approved, { approvedById });
        return wf;
    }
    async publish(id) {
        await this.ensureExists(id);
        const now = new Date();
        const [, , publish] = await this.prisma.$transaction([
            this.prisma.event.update({ where: { id }, data: { status: client_1.EventStatus.published } }),
            this.prisma.eventWorkflow.upsert({
                where: { eventId: id },
                update: { status: client_1.WorkflowStatus.published, publishedAt: now },
                create: { eventId: id, status: client_1.WorkflowStatus.published, publishedAt: now },
            }),
            this.prisma.eventPublish.upsert({
                where: { eventId: id },
                update: { publishedAt: now, unpublishedAt: null },
                create: { eventId: id, publishedAt: now },
            }),
        ]);
        return publish;
    }
    async unpublish(id) {
        await this.ensureExists(id);
        const now = new Date();
        await this.prisma.$transaction([
            this.prisma.event.update({ where: { id }, data: { status: client_1.EventStatus.draft } }),
            this.prisma.eventPublish.updateMany({ where: { eventId: id }, data: { unpublishedAt: now } }),
        ]);
        return { success: true };
    }
    async archive(id) {
        return this.transitionWorkflow(id, client_1.WorkflowStatus.archived, client_1.EventStatus.archived);
    }
    async persistStep1(id, dto) {
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
        }
        catch (e) {
            throw this.mapPrismaError(e);
        }
    }
    async persistStep2(id, dto) {
        const start = new Date(dto.startDate);
        const end = dto.endDate ? new Date(dto.endDate) : null;
        if (end && end <= start) {
            throw new common_1.BadRequestException('La date de fin doit être postérieure à la date de début.');
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
    async persistStep3(id, input) {
        const resolved = this.applyModuleConstraints(input);
        const ops = MODULE_KEYS.map((key) => this.prisma.eventModule.upsert({
            where: { eventId_moduleKey: { eventId: id, moduleKey: key } },
            update: { enabled: resolved[key] },
            create: { eventId: id, moduleKey: key, enabled: resolved[key] },
        }));
        ops.push(this.prisma.eventSettings.upsert({
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
        }));
        await this.prisma.$transaction(ops);
        return { modules: resolved };
    }
    async persistStep4(id, dto) {
        const tokens = {
            colors: dto.colors ?? {},
            typography: dto.typography ?? {},
            logoUrl: dto.logoUrl ?? null,
            bannerUrl: dto.bannerUrl ?? null,
        };
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
    async persistStep5(id, dto) {
        const event = await this.prisma.event.findUnique({ where: { id }, select: { metadata: true } });
        const meta = event?.metadata ?? {};
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
                },
            },
        });
    }
    applyModuleConstraints(input) {
        const guests = true;
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
    modulesToMap(modules) {
        const map = {};
        for (const key of MODULE_KEYS)
            map[key] = key === 'guests';
        for (const m of modules)
            map[m.moduleKey] = m.enabled;
        return map;
    }
    async markStepCompleted(id, currentMeta, step) {
        const meta = currentMeta ?? {};
        const completedSteps = Array.from(new Set([...(meta.completedSteps ?? []), step]));
        const nextStep = Math.min(Math.max(step + 1, ...completedSteps) || step, 6);
        await this.prisma.event.update({
            where: { id },
            data: {
                currentStep: nextStep,
                metadata: { ...meta, completedSteps },
            },
        });
    }
    defaultSettings(eventId) {
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
    async transitionWorkflow(id, wf, ev) {
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
    async upsertWorkflow(id, status, extra = {}) {
        await this.ensureExists(id);
        return this.prisma.eventWorkflow.upsert({
            where: { eventId: id },
            update: { status, ...extra },
            create: { eventId: id, status, ...extra },
        });
    }
    async ensureExists(id) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) {
            throw new common_1.NotFoundException(`Événement introuvable (id: ${id}).`);
        }
        return event;
    }
    async validateDto(cls, body) {
        const instance = (0, class_transformer_1.plainToInstance)(cls, body ?? {}, { enableImplicitConversion: true });
        const validationErrors = await (0, class_validator_1.validate)(instance, {
            whitelist: true,
            forbidNonWhitelisted: false,
        });
        if (validationErrors.length > 0) {
            const messages = validationErrors.flatMap((e) => e.constraints ? Object.values(e.constraints) : []);
            throw new common_1.BadRequestException({ message: 'Validation échouée.', errors: messages });
        }
        return instance;
    }
    mapPrismaError(e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                const target = e.meta?.target?.join(', ') ?? 'champ unique';
                return new common_1.ConflictException(`Valeur déjà utilisée (${target}). Le slug doit être unique.`);
            }
            if (e.code === 'P2025') {
                return new common_1.NotFoundException('Ressource introuvable.');
            }
        }
        return e;
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map