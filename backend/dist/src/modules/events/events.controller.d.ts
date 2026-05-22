import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventSetupStepDto, UpdateEventSettingsDto, UpdateEventModulesDto } from './dto/event-setup.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(organizationId?: string): Promise<({
        guests: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            status: import("@prisma/client").$Enums.GuestStatus;
            eventId: string;
            fullName: string;
            email: string | null;
            phone: string | null;
            guestRole: import("@prisma/client").$Enums.GuestRole;
            qrCode: string | null;
            invitationUrl: string | null;
            ticketId: string | null;
        }[];
        sessions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            title: string;
            description: string | null;
            eventId: string;
            venue: string | null;
            startAt: Date;
            endAt: Date;
            capacity: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdById: string;
        title: string;
        slug: string;
        description: string | null;
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
        status: import("@prisma/client").$Enums.EventStatus;
        setupCompleted: boolean;
        currentStep: number;
    })[]>;
    create(dto: CreateEventDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdById: string;
        title: string;
        slug: string;
        description: string | null;
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
        status: import("@prisma/client").$Enums.EventStatus;
        setupCompleted: boolean;
        currentStep: number;
    }>;
    findOne(id: string): Promise<{
        guests: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            status: import("@prisma/client").$Enums.GuestStatus;
            eventId: string;
            fullName: string;
            email: string | null;
            phone: string | null;
            guestRole: import("@prisma/client").$Enums.GuestRole;
            qrCode: string | null;
            invitationUrl: string | null;
            ticketId: string | null;
        }[];
        sessions: ({
            sessionSpeakers: ({
                speaker: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: string | null;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                    title: string | null;
                    fullName: string;
                    email: string | null;
                    phone: string | null;
                    bio: string | null;
                    avatarUrl: string | null;
                    socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
                };
            } & {
                createdAt: Date;
                sessionId: string;
                speakerId: string;
                role: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            title: string;
            description: string | null;
            eventId: string;
            venue: string | null;
            startAt: Date;
            endAt: Date;
            capacity: number | null;
        })[];
        sponsors: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string;
            companyName: string;
            logoUrl: string | null;
            website: string | null;
            contactEmail: string | null;
            sponsorshipTier: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdById: string;
        title: string;
        slug: string;
        description: string | null;
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
        status: import("@prisma/client").$Enums.EventStatus;
        setupCompleted: boolean;
        currentStep: number;
    }>;
    update(id: string, dto: UpdateEventDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdById: string;
        title: string;
        slug: string;
        description: string | null;
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
        status: import("@prisma/client").$Enums.EventStatus;
        setupCompleted: boolean;
        currentStep: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdById: string;
        title: string;
        slug: string;
        description: string | null;
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
        status: import("@prisma/client").$Enums.EventStatus;
        setupCompleted: boolean;
        currentStep: number;
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
