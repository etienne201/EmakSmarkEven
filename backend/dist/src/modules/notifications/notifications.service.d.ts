import { PrismaService } from '../../database/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        title: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        content: string;
        eventId: string | null;
        userId: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        sentAt: Date | null;
    }[]>;
    send(dto: any): Promise<{
        id: string;
        title: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        content: string;
        eventId: string | null;
        userId: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        sentAt: Date | null;
    }>;
    sendBulk(dto: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
