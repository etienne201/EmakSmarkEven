import { AdminService } from './admin.service';
import { CreateGuestDto } from '../guest/dto/create-guest.dto';
import { UpdateEventConfigDto } from './dto/admin.dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getStats(id: string): Promise<{
        totalGuests: number;
        confirmedGuests: number;
        checkedInGuests: number;
    }>;
    getGuests(id: string): Promise<({
        ticket: {
            id: string;
            expiresAt: Date | null;
            status: import("@prisma/client").$Enums.TicketStatus;
            guestId: string;
            code: string;
            ticketType: string;
            issuedAt: Date;
        };
    } & {
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
    })[]>;
    updateConfig(id: string, data: UpdateEventConfigDto): Promise<{
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
    addGuest(id: string, guestData: CreateGuestDto): Promise<{
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
    }>;
}
