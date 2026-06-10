import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventSetupStepDto, UpdateEventSettingsDto, UpdateEventModulesDto } from './dto/event-setup.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(organizationId?: string): Promise<({
        sessions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string;
            venue: string | null;
            startAt: Date;
            endAt: Date;
            capacity: number | null;
        }[];
        guests: {
            id: string;
            email: string | null;
            fullName: string;
            phone: string | null;
            status: import("@prisma/client").$Enums.GuestStatus;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string;
            guestRole: import("@prisma/client").$Enums.GuestRole;
            qrCode: string | null;
            invitationUrl: string | null;
            ticketId: string | null;
            tableId: string | null;
        }[];
    } & {
        id: string;
        organizationId: string;
        status: import("@prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
        title: string;
        slug: string;
        eventType: import("@prisma/client").$Enums.EventTypeKey;
        visibility: import("@prisma/client").$Enums.VisibilityType;
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    create(dto: CreateEventDto): Promise<{
        id: string;
        organizationId: string;
        status: import("@prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
        title: string;
        slug: string;
        eventType: import("@prisma/client").$Enums.EventTypeKey;
        visibility: import("@prisma/client").$Enums.VisibilityType;
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findOne(id: string): Promise<{
        sessions: ({
            sessionSpeakers: ({
                speaker: {
                    id: string;
                    organizationId: string | null;
                    email: string | null;
                    fullName: string;
                    avatarUrl: string | null;
                    phone: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                    bio: string | null;
                    socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
                };
            } & {
                createdAt: Date;
                role: string | null;
                sessionId: string;
                speakerId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string;
            venue: string | null;
            startAt: Date;
            endAt: Date;
            capacity: number | null;
        })[];
        guests: {
            id: string;
            email: string | null;
            fullName: string;
            phone: string | null;
            status: import("@prisma/client").$Enums.GuestStatus;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string;
            guestRole: import("@prisma/client").$Enums.GuestRole;
            qrCode: string | null;
            invitationUrl: string | null;
            ticketId: string | null;
            tableId: string | null;
        }[];
        sponsors: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string;
            logoUrl: string | null;
            website: string | null;
            companyName: string;
            contactEmail: string | null;
            sponsorshipTier: string | null;
        }[];
    } & {
        id: string;
        organizationId: string;
        status: import("@prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
        title: string;
        slug: string;
        eventType: import("@prisma/client").$Enums.EventTypeKey;
        visibility: import("@prisma/client").$Enums.VisibilityType;
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, dto: UpdateEventDto): Promise<{
        id: string;
        organizationId: string;
        status: import("@prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
        title: string;
        slug: string;
        eventType: import("@prisma/client").$Enums.EventTypeKey;
        visibility: import("@prisma/client").$Enums.VisibilityType;
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        organizationId: string;
        status: import("@prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
        title: string;
        slug: string;
        eventType: import("@prisma/client").$Enums.EventTypeKey;
        visibility: import("@prisma/client").$Enums.VisibilityType;
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    setupStatus(id: string): Promise<{
        currentStep: number;
    }>;
    setupStep(id: string, stepId: string, dto: EventSetupStepDto): Promise<{
        success: boolean;
    }>;
    setupFinalize(id: string): Promise<{
        success: boolean;
    }>;
    getSettings(id: string): Promise<{}>;
    updateSettings(id: string, dto: UpdateEventSettingsDto): Promise<{
        success: boolean;
    }>;
    getModules(id: string): Promise<any[]>;
    updateModules(id: string, body: UpdateEventModulesDto): Promise<{
        success: boolean;
    }>;
    getWorkflow(id: string): Promise<{
        status: string;
    }>;
    workflowReview(id: string): Promise<{
        success: boolean;
    }>;
    workflowApprove(id: string): Promise<{
        success: boolean;
    }>;
    workflowPublish(id: string): Promise<{
        success: boolean;
    }>;
    workflowArchive(id: string): Promise<{
        success: boolean;
    }>;
    publish(id: string): Promise<{
        success: boolean;
    }>;
    unpublish(id: string): Promise<{
        success: boolean;
    }>;
}
