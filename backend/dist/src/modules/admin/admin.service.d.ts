import { PrismaService } from '../../database/prisma.service';
import { CreateGuestDto } from '../guest/dto/create-guest.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getEventStats(eventId: string): Promise<{
        totalGuests: number;
        confirmedGuests: number;
        checkedInGuests: number;
    }>;
    getGuests(eventId: string): Promise<({
        ticket: {
            id: string;
            status: import("node_modules/@prisma/client/default").$Enums.TicketStatus;
            expiresAt: Date | null;
            guestId: string;
            code: string;
            ticketType: string;
            issuedAt: Date;
        };
    } & {
        id: string;
        email: string | null;
        fullName: string;
        phone: string | null;
        status: import("node_modules/@prisma/client/default").$Enums.GuestStatus;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        guestRole: import("node_modules/@prisma/client/default").$Enums.GuestRole;
        qrCode: string | null;
        invitationUrl: string | null;
        ticketId: string | null;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    updateEventConfig(eventId: string, data: any): Promise<{
        id: string;
        organizationId: string;
        status: import("node_modules/@prisma/client/default").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        title: string;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
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
    addGuest(eventId: string, guestData: CreateGuestDto): Promise<{
        id: string;
        email: string | null;
        fullName: string;
        phone: string | null;
        status: import("node_modules/@prisma/client/default").$Enums.GuestStatus;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        guestRole: import("node_modules/@prisma/client/default").$Enums.GuestRole;
        qrCode: string | null;
        invitationUrl: string | null;
        ticketId: string | null;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
    }>;
}
