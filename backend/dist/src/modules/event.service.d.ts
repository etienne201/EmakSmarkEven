import { z } from 'zod';
import { createEventSchema, updateEventSchema } from '../validations/event.schema';
export declare class EventService {
    static listEvents(organizationId: string): Promise<any>;
    static getEventById(eventId: string, organizationId?: string): Promise<any>;
    static createEvent(data: z.infer<typeof createEventSchema>, organizationId: string, userId: string): Promise<any>;
    static updateEvent(eventId: string, data: z.infer<typeof updateEventSchema>, organizationId: string): Promise<any>;
    static deleteEvent(eventId: string, organizationId: string): Promise<any>;
}
