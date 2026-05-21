import { z } from 'zod';
import { EventTypeKey, VisibilityType } from '@prisma/client';

export const createEventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(255),
  slug: z.string().max(255).optional(),
  description: z.string().optional(),
  eventType: z.nativeEnum(EventTypeKey),
  visibility: z.nativeEnum(VisibilityType).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const updateEventSchema = createEventSchema.partial().extend({
  status: z.enum(['draft', 'review', 'published', 'completed', 'archived']).optional(),
  setupCompleted: z.boolean().optional(),
});
