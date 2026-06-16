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
        ipAddress: string | null;
        userAgent: string | null;
        userId: string | null;
        action: string;
        targetType: string | null;
        targetId: string | null;
        details: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        eventId: string | null;
    }[]>;
    getCheckins(eventId: string): Promise<{
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
    getEngagement(eventId: string): Promise<{
        rate: number;
        totalInteractions: number;
    }>;
    getGuestsAnalysis(eventId: string): Promise<(import("node_modules/@prisma/client/default").Prisma.PickEnumerable<import("node_modules/@prisma/client/default").Prisma.GuestGroupByOutputType, "status"[]> & {
        _count: number;
    })[]>;
}
