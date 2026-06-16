import { PrismaService } from '../../database/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        eventId: string | null;
        type: import("node_modules/@prisma/client/default").$Enums.NotificationType;
        title: string;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        content: string;
        sentAt: Date | null;
    }[]>;
    send(dto: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        eventId: string | null;
        type: import("node_modules/@prisma/client/default").$Enums.NotificationType;
        title: string;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        content: string;
        sentAt: Date | null;
    }>;
    sendBulk(dto: any): Promise<import("node_modules/@prisma/client/default").Prisma.BatchPayload>;
}
