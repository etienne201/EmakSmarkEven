import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(organizationId?: string): Promise<({
        sessions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            eventId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            title: string;
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
            eventId: string;
            guestRole: import("@prisma/client").$Enums.GuestRole;
            qrCode: string | null;
            invitationUrl: string | null;
            ticketId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        organizationId: string;
        status: import("@prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        slug: string;
        createdById: string;
        title: string;
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
    })[]>;
    create(dto: CreateEventDto): Promise<{
        id: string;
        organizationId: string;
        status: import("@prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        slug: string;
        createdById: string;
        title: string;
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
    }>;
    findOne(id: string): Promise<{
        sessions: ({
            sessionSpeakers: ({
                speaker: {
                    id: string;
                    email: string | null;
                    organizationId: string | null;
                    fullName: string;
                    avatarUrl: string | null;
                    phone: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                    title: string | null;
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
            eventId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            title: string;
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
            eventId: string;
            guestRole: import("@prisma/client").$Enums.GuestRole;
            qrCode: string | null;
            invitationUrl: string | null;
            ticketId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        sponsors: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        slug: string;
        createdById: string;
        title: string;
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
    }>;
    update(id: string, dto: UpdateEventDto): Promise<{
        id: string;
        organizationId: string;
        status: import("@prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        slug: string;
        createdById: string;
        title: string;
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
    }>;
    remove(id: string): Promise<{
        id: string;
        organizationId: string;
        status: import("@prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        slug: string;
        createdById: string;
        title: string;
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
    }>;
    setupStatus(id: string): Promise<{
        currentStep: number;
    }>;
    setupStep(id: string, stepId: string, dto: any): Promise<{
        success: boolean;
    }>;
    setupFinalize(id: string): Promise<{
        success: boolean;
    }>;
    getSettings(id: string): Promise<{}>;
    updateSettings(id: string, dto: any): Promise<{
        success: boolean;
    }>;
    getModules(id: string): Promise<any[]>;
    updateModules(id: string, body: {
        modules: string[];
    }): Promise<{
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
