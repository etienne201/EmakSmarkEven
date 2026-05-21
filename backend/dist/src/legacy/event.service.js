"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../lib/errors");
class EventService {
    static async listEvents(organizationId) {
        return prisma_1.default.event.findMany({
            where: { organizationId },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getEventById(eventId, organizationId) {
        const event = await prisma_1.default.event.findUnique({
            where: { id: eventId },
            include: {
                settings: true,
                workflow: true,
                modules: true,
            }
        });
        if (!event) {
            throw new errors_1.NotFoundError('Event not found');
        }
        if (organizationId && event.organizationId !== organizationId) {
            throw new errors_1.ForbiddenError('You do not have access to this event');
        }
        return event;
    }
    static async createEvent(data, organizationId, userId) {
        const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        return prisma_1.default.event.create({
            data: {
                ...data,
                slug,
                organizationId,
                createdById: userId,
                settings: {
                    create: {}
                },
                workflow: {
                    create: {}
                },
                analytics: {
                    create: {}
                }
            },
        });
    }
    static async updateEvent(eventId, data, organizationId) {
        await this.getEventById(eventId, organizationId);
        return prisma_1.default.event.update({
            where: { id: eventId },
            data,
        });
    }
    static async deleteEvent(eventId, organizationId) {
        await this.getEventById(eventId, organizationId);
        return prisma_1.default.event.delete({
            where: { id: eventId },
        });
    }
}
exports.EventService = EventService;
//# sourceMappingURL=event.service.js.map