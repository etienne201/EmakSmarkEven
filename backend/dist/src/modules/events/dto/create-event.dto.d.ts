import { EventTypeKey, VisibilityType } from '@prisma/client';
export declare class CreateEventDto {
    title: string;
    slug: string;
    eventType: EventTypeKey;
    startDate: string;
    endDate?: string;
    description?: string;
    visibility?: VisibilityType;
    language?: string;
    location?: string;
    city?: string;
    country?: string;
}
