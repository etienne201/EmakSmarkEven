import { PrismaService } from '../../database/prisma.service';
export declare class GuestService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(eventId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.GuestStatus;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        guestRole: import("@prisma/client").$Enums.GuestRole;
        qrCode: string | null;
        invitationUrl: string | null;
        ticketId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.GuestStatus;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        guestRole: import("@prisma/client").$Enums.GuestRole;
        qrCode: string | null;
        invitationUrl: string | null;
        ticketId: string | null;
    }>;
    create(data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.GuestStatus;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        guestRole: import("@prisma/client").$Enums.GuestRole;
        qrCode: string | null;
        invitationUrl: string | null;
        ticketId: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.GuestStatus;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        guestRole: import("@prisma/client").$Enums.GuestRole;
        qrCode: string | null;
        invitationUrl: string | null;
        ticketId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.GuestStatus;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        guestRole: import("@prisma/client").$Enums.GuestRole;
        qrCode: string | null;
        invitationUrl: string | null;
        ticketId: string | null;
    }>;
    importGuests(eventId: string, file: any): Promise<{
        imported: number;
    }>;
    exportGuests(eventId: string): Promise<{
        url: string;
    }>;
    rsvp(id: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.GuestStatus;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
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
