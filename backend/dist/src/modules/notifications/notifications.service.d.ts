import { PrismaService } from '../../database/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        content: string;
        eventId: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string | null;
        sentAt: Date | null;
    }[]>;
    send(dto: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        content: string;
        eventId: string | null;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string | null;
        sentAt: Date | null;
    }>;
    sendBulk(dto: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
