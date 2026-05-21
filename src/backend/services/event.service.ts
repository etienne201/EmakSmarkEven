import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError } from '../lib/errors';
import { z } from 'zod';
import { createEventSchema, updateEventSchema } from '../validations/event.schema';

export class EventService {
  static async listEvents(organizationId: string) {
    return prisma.event.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getEventById(eventId: string, organizationId?: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        settings: true,
        workflow: true,
        modules: true,
      }
    });

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (organizationId && event.organizationId !== organizationId) {
      throw new ForbiddenError('You do not have access to this event');
    }

    return event;
  }

  static async createEvent(data: z.infer<typeof createEventSchema>, organizationId: string, userId: string) {
    // Basic slug generation if not provided
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    return prisma.event.create({
      data: {
        ...data,
        slug,
        organizationId,
        createdById: userId,
        settings: {
          create: {} // Default settings
        },
        workflow: {
          create: {} // Default workflow
        },
        analytics: {
          create: {} // Default analytics
        }
      },
    });
  }

  static async updateEvent(eventId: string, data: z.infer<typeof updateEventSchema>, organizationId: string) {
    // Ensure event exists and belongs to organization
    await this.getEventById(eventId, organizationId);

    return prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

  static async deleteEvent(eventId: string, organizationId: string) {
    await this.getEventById(eventId, organizationId);

    return prisma.event.delete({
      where: { id: eventId },
    });
  }
}
