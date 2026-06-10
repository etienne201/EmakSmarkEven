import { PrismaService } from '../../database/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(eventId: string): Promise<{
        views: number;
        checkins: number;
    }>;
    getViews(eventId: string): Promise<{
        id: string;
        createdAt: Date;
        eventId: string | null;
        userId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        action: string;
        targetType: string | null;
        targetId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    getCheckins(eventId: string): Promise<{
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
    getEngagement(eventId: string): Promise<{
        rate: number;
        totalInteractions: number;
    }>;
    getGuestsAnalysis(eventId: string): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.GuestGroupByOutputType, "status"[]> & {
        _count: number;
    })[]>;
}
