import { PrismaService } from '../../database/prisma.service';
export declare class GuestService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(eventId: string): Promise<{
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
    findOne(id: string): Promise<{
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
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
    remove(id: string): Promise<{
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
    importGuests(eventId: string, file: any): Promise<{
        imported: number;
    }>;
    exportGuests(eventId: string): Promise<{
        url: string;
    }>;
    rsvp(id: string, data: any): Promise<{
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
