import { PrismaService } from '../../database/prisma.service';
export declare class GuestService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(eventId: string): Promise<{
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
    findOne(id: string): Promise<{
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
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
    remove(id: string): Promise<{
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
