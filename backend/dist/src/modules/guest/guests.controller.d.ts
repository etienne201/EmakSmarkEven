import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
export declare class GuestsController {
    private readonly guestService;
    constructor(guestService: GuestService);
    findAll(id: string): Promise<{
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
    }[]>;
    create(id: string, dto: CreateGuestDto): Promise<{
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
    }>;
    findOne(guestId: string): Promise<{
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
    }>;
    update(guestId: string, dto: UpdateGuestDto): Promise<{
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
    }>;
    remove(guestId: string): Promise<{
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
    }>;
    importGuests(id: string, body: any): Promise<{
        imported: number;
    }>;
    exportGuests(id: string): Promise<{
        url: string;
    }>;
    rsvp(guestId: string, body: {
        status: string;
    }): Promise<{
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
    }>;
}
