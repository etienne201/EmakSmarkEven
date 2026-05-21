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
        action: string;
        targetType: string | null;
        targetId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    getCheckins(eventId: string): Promise<{
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
    getEngagement(eventId: string): Promise<{
        rate: number;
        totalInteractions: number;
    }>;
    getGuestsAnalysis(eventId: string): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.GuestGroupByOutputType, "status"[]> & {
        _count: number;
    })[]>;
}
