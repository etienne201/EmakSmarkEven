import { NotificationsService } from './notifications.service';
import { SendNotificationDto, SendBulkNotificationDto } from './dto/send-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
    send(dto: SendNotificationDto): Promise<{
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
    sendBulk(dto: SendBulkNotificationDto): Promise<import("node_modules/@prisma/client/default").Prisma.BatchPayload>;
}
