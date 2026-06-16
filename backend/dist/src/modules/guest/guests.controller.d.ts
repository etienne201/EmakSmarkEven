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
        status: import("node_modules/@prisma/client/default").$Enums.GuestStatus;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        guestRole: import("node_modules/@prisma/client/default").$Enums.GuestRole;
        qrCode: string | null;
        invitationUrl: string | null;
        ticketId: string | null;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    create(id: string, dto: CreateGuestDto): Promise<{
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
    findOne(guestId: string): Promise<{
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
    update(guestId: string, dto: UpdateGuestDto): Promise<{
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
    remove(guestId: string): Promise<{
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
