"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestService = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../lib/errors");
class GuestService {
    static async listGuests(eventId) {
        return prisma_1.default.guest.findMany({
            where: { eventId },
            include: { ticket: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async addGuest(eventId, data) {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        return prisma_1.default.guest.create({
            data: {
                eventId,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                guestRole: data.guestRole || 'attendee',
                ticket: {
                    create: {
                        code,
                        ticketType: 'standard',
                    }
                }
            },
            include: { ticket: true }
        });
    }
    static async getGuestByTicketCode(code) {
        const ticket = await prisma_1.default.guestTicket.findUnique({
            where: { code },
            include: { guest: true }
        });
        if (!ticket) {
            throw new errors_1.NotFoundError('Ticket not found');
        }
        return ticket.guest;
    }
}
exports.GuestService = GuestService;
//# sourceMappingURL=guest.service.js.map