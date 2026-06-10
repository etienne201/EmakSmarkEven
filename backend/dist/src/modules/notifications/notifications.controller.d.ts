import { NotificationsService } from './notifications.service';
import { SendNotificationDto, SendBulkNotificationDto } from './dto/send-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
    send(dto: SendNotificationDto): Promise<{
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
    sendBulk(dto: SendBulkNotificationDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
