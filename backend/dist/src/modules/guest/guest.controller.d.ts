import { GuestService } from './guest.service';
export declare class GuestController {
    private guestService;
    constructor(guestService: GuestService);
    getInfo(id: string): Promise<{
        event: {
            id: string;
            organizationId: string;
            status: import("@prisma/client").$Enums.EventStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
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
        };
    } & {
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
    }>;
    confirm(id: string): Promise<{
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
    }>;
}
