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
            status: import("@prisma/client").$Enums.TicketStatus;
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
        status: import("@prisma/client").$Enums.GuestStatus;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        guestRole: import("@prisma/client").$Enums.GuestRole;
        qrCode: string | null;
        invitationUrl: string | null;
        ticketId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    updateEventConfig(eventId: string, data: any): Promise<{
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
    addGuest(eventId: string, guestData: CreateGuestDto): Promise<{
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
