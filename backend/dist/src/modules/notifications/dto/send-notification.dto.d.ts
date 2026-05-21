import { NotificationType } from '@prisma/client';
export declare class SendNotificationDto {
    type: NotificationType;
    title: string;
    content: string;
    userId?: string;
    eventId?: string;
}
export declare class SendBulkNotificationDto extends SendNotificationDto {
    userIds: string[];
}
