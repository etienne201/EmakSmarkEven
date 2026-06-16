import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SetupModulesDto, UpdateEventSettingsDto } from './dto/event-setup.dto';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(organizationId?: string): Promise<({
        settings: {
            id: string;
            updatedAt: Date;
            eventId: string;
            rsvpEnabled: boolean;
            qrEnabled: boolean;
            checkinEnabled: boolean;
            networkingEnabled: boolean;
            livestreamEnabled: boolean;
            guestLimit: number | null;
            customRules: Prisma.JsonValue | null;
        };
        modules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            version: number;
            moduleKey: string;
            enabled: boolean;
            config: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        organizationId: string;
        status: import("node_modules/@prisma/client/default").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        title: string;
        metadata: Prisma.JsonValue | null;
        createdById: string;
        eventType: import("node_modules/@prisma/client/default").$Enums.EventTypeKey;
        visibility: import("node_modules/@prisma/client/default").$Enums.VisibilityType;
        language: string;
        timezone: string | null;
        startDate: Date;
        endDate: Date | null;
        coverImageUrl: string | null;
        location: string | null;
        city: string | null;
        country: string | null;
        setupCompleted: boolean;
        currentStep: number;
    })[]>;
    findOne(id: string): Promise<{
        sessions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            venue: string | null;
            eventId: string;
            title: string;
            metadata: Prisma.JsonValue | null;
            startAt: Date;
            endAt: Date;
            capacity: number | null;
        }[];
        workflow: {
            id: string;
            status: import("node_modules/@prisma/client/default").$Enums.WorkflowStatus;
            updatedAt: Date;
            eventId: string;
            metadata: Prisma.JsonValue | null;
            currentStep: string | null;
            approvedById: string | null;
            publishedAt: Date | null;
            archivedAt: Date | null;
        };
        settings: {
            id: string;
            updatedAt: Date;
            eventId: string;
            rsvpEnabled: boolean;
            qrEnabled: boolean;
            checkinEnabled: boolean;
            networkingEnabled: boolean;
            livestreamEnabled: boolean;
            guestLimit: number | null;
            customRules: Prisma.JsonValue | null;
        };
        modules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            version: number;
            moduleKey: string;
            enabled: boolean;
            config: Prisma.JsonValue | null;
        }[];
        themes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            eventId: string;
            version: number;
            templateId: string | null;
            tokens: Prisma.JsonValue;
            canvas: Prisma.JsonValue | null;
            customCss: string | null;
        }[];
        sponsors: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            logoUrl: string | null;
            website: string | null;
            eventId: string;
            metadata: Prisma.JsonValue | null;
            companyName: string;
            contactEmail: string | null;
            sponsorshipTier: string | null;
        }[];
    } & {
        id: string;
        organizationId: string;
        status: import("node_modules/@prisma/client/default").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        title: string;
        metadata: Prisma.JsonValue | null;
        createdById: string;
        eventType: import("node_modules/@prisma/client/default").$Enums.EventTypeKey;
        visibility: import("node_modules/@prisma/client/default").$Enums.VisibilityType;
        language: string;
        timezone: string | null;
        startDate: Date;
        endDate: Date | null;
        coverImageUrl: string | null;
        location: string | null;
        city: string | null;
        country: string | null;
        setupCompleted: boolean;
        currentStep: number;
    }>;
    create(dto: CreateEventDto, user: {
        id: string;
        organizationId?: string | null;
    }): Promise<{
        id: string;
        organizationId: string;
        status: import("node_modules/@prisma/client/default").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        title: string;
        metadata: Prisma.JsonValue | null;
        createdById: string;
        eventType: import("node_modules/@prisma/client/default").$Enums.EventTypeKey;
        visibility: import("node_modules/@prisma/client/default").$Enums.VisibilityType;
        language: string;
        timezone: string | null;
        startDate: Date;
        endDate: Date | null;
        coverImageUrl: string | null;
        location: string | null;
        city: string | null;
        country: string | null;
        setupCompleted: boolean;
        currentStep: number;
    }>;
    update(id: string, dto: UpdateEventDto): Promise<{
        id: string;
        organizationId: string;
        status: import("node_modules/@prisma/client/default").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        title: string;
        metadata: Prisma.JsonValue | null;
        createdById: string;
        eventType: import("node_modules/@prisma/client/default").$Enums.EventTypeKey;
        visibility: import("node_modules/@prisma/client/default").$Enums.VisibilityType;
        language: string;
        timezone: string | null;
        startDate: Date;
        endDate: Date | null;
        coverImageUrl: string | null;
        location: string | null;
        city: string | null;
        country: string | null;
        setupCompleted: boolean;
        currentStep: number;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    getSetupStatus(id: string): Promise<{
        eventId: string;
        currentStep: number;
        completedSteps: number[];
        setupCompleted: boolean;
        status: import("node_modules/@prisma/client/default").$Enums.EventStatus;
        steps: {
            1: {
                title: string;
                slug: string;
                description: string;
                eventType: import("node_modules/@prisma/client/default").$Enums.EventTypeKey;
                language: string;
                visibility: import("node_modules/@prisma/client/default").$Enums.VisibilityType;
            };
            2: {
                location: string;
                city: string;
                country: string;
                timezone: string;
                startDate: Date;
                endDate: Date;
            };
            3: {
                modules: Record<string, boolean>;
                settings: {
                    id: string;
                    updatedAt: Date;
                    eventId: string;
                    rsvpEnabled: boolean;
                    qrEnabled: boolean;
                    checkinEnabled: boolean;
                    networkingEnabled: boolean;
                    livestreamEnabled: boolean;
                    guestLimit: number | null;
                    customRules: Prisma.JsonValue | null;
                };
            };
            4: {
                themes: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    eventId: string;
                    version: number;
                    templateId: string | null;
                    tokens: Prisma.JsonValue;
                    canvas: Prisma.JsonValue | null;
                    customCss: string | null;
                }[];
            };
            5: {
                access: Record<string, unknown>;
            };
        };
    }>;
    saveStep(id: string, stepNumber: number, body: unknown): Promise<{
        eventId: string;
        currentStep: number;
        completedSteps: number[];
        setupCompleted: boolean;
        status: import("node_modules/@prisma/client/default").$Enums.EventStatus;
        steps: {
            1: {
                title: string;
                slug: string;
                description: string;
                eventType: import("node_modules/@prisma/client/default").$Enums.EventTypeKey;
                language: string;
                visibility: import("node_modules/@prisma/client/default").$Enums.VisibilityType;
            };
            2: {
                location: string;
                city: string;
                country: string;
                timezone: string;
                startDate: Date;
                endDate: Date;
            };
            3: {
                modules: Record<string, boolean>;
                settings: {
                    id: string;
                    updatedAt: Date;
                    eventId: string;
                    rsvpEnabled: boolean;
                    qrEnabled: boolean;
                    checkinEnabled: boolean;
                    networkingEnabled: boolean;
                    livestreamEnabled: boolean;
                    guestLimit: number | null;
                    customRules: Prisma.JsonValue | null;
                };
            };
            4: {
                themes: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    eventId: string;
                    version: number;
                    templateId: string | null;
                    tokens: Prisma.JsonValue;
                    canvas: Prisma.JsonValue | null;
                    customCss: string | null;
                }[];
            };
            5: {
                access: Record<string, unknown>;
            };
        };
    }>;
    finalizeSetup(id: string): Promise<{
        eventId: string;
        currentStep: number;
        completedSteps: number[];
        setupCompleted: boolean;
        status: import("node_modules/@prisma/client/default").$Enums.EventStatus;
        steps: {
            1: {
                title: string;
                slug: string;
                description: string;
                eventType: import("node_modules/@prisma/client/default").$Enums.EventTypeKey;
                language: string;
                visibility: import("node_modules/@prisma/client/default").$Enums.VisibilityType;
            };
            2: {
                location: string;
                city: string;
                country: string;
                timezone: string;
                startDate: Date;
                endDate: Date;
            };
            3: {
                modules: Record<string, boolean>;
                settings: {
                    id: string;
                    updatedAt: Date;
                    eventId: string;
                    rsvpEnabled: boolean;
                    qrEnabled: boolean;
                    checkinEnabled: boolean;
                    networkingEnabled: boolean;
                    livestreamEnabled: boolean;
                    guestLimit: number | null;
                    customRules: Prisma.JsonValue | null;
                };
            };
            4: {
                themes: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    eventId: string;
                    version: number;
                    templateId: string | null;
                    tokens: Prisma.JsonValue;
                    canvas: Prisma.JsonValue | null;
                    customCss: string | null;
                }[];
            };
            5: {
                access: Record<string, unknown>;
            };
        };
        success: boolean;
    }>;
    getSettings(id: string): Promise<{
        eventId: string;
        rsvpEnabled: boolean;
        qrEnabled: boolean;
        checkinEnabled: boolean;
        networkingEnabled: boolean;
        livestreamEnabled: boolean;
        guestLimit: any;
        customRules: any;
    }>;
    updateSettings(id: string, dto: UpdateEventSettingsDto): Promise<{
        id: string;
        updatedAt: Date;
        eventId: string;
        rsvpEnabled: boolean;
        qrEnabled: boolean;
        checkinEnabled: boolean;
        networkingEnabled: boolean;
        livestreamEnabled: boolean;
        guestLimit: number | null;
        customRules: Prisma.JsonValue | null;
    }>;
    getModules(id: string): Promise<Record<string, boolean>>;
    updateModules(id: string, modules: SetupModulesDto): Promise<{
        modules: Record<"notifications" | "invitations" | "analytics" | "guests" | "qrCheckin" | "tables" | "seating" | "badges", boolean>;
    }>;
    getWorkflow(id: string): Promise<{
        id: string;
        status: import("node_modules/@prisma/client/default").$Enums.WorkflowStatus;
        updatedAt: Date;
        eventId: string;
        metadata: Prisma.JsonValue | null;
        currentStep: string | null;
        approvedById: string | null;
        publishedAt: Date | null;
        archivedAt: Date | null;
    } | {
        eventId: string;
        status: "draft";
    }>;
    submitForReview(id: string): Promise<{
        id: string;
        status: import("node_modules/@prisma/client/default").$Enums.WorkflowStatus;
        updatedAt: Date;
        eventId: string;
        metadata: Prisma.JsonValue | null;
        currentStep: string | null;
        approvedById: string | null;
        publishedAt: Date | null;
        archivedAt: Date | null;
    } | {
        eventId: string;
        status: "draft";
    }>;
    approve(id: string, approvedById: string): Promise<{
        id: string;
        status: import("node_modules/@prisma/client/default").$Enums.WorkflowStatus;
        updatedAt: Date;
        eventId: string;
        metadata: Prisma.JsonValue | null;
        currentStep: string | null;
        approvedById: string | null;
        publishedAt: Date | null;
        archivedAt: Date | null;
    }>;
    publish(id: string): Promise<{
        id: string;
        eventId: string;
        metadata: Prisma.JsonValue | null;
        publishedAt: Date | null;
        publicUrl: string | null;
        shortUrl: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoImage: string | null;
        customDomain: string | null;
        unpublishedAt: Date | null;
    }>;
    unpublish(id: string): Promise<{
        success: boolean;
    }>;
    archive(id: string): Promise<{
        id: string;
        status: import("node_modules/@prisma/client/default").$Enums.WorkflowStatus;
        updatedAt: Date;
        eventId: string;
        metadata: Prisma.JsonValue | null;
        currentStep: string | null;
        approvedById: string | null;
        publishedAt: Date | null;
        archivedAt: Date | null;
    } | {
        eventId: string;
        status: "draft";
    }>;
    private persistStep1;
    private persistStep2;
    private persistStep3;
    private persistStep4;
    private persistStep5;
    private applyModuleConstraints;
    private modulesToMap;
    private markStepCompleted;
    private defaultSettings;
    private transitionWorkflow;
    private upsertWorkflow;
    private ensureExists;
    private validateDto;
    private mapPrismaError;
}
