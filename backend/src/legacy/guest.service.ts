import prisma from '../lib/prisma';
import { NotFoundError } from '../lib/errors';
import { GuestRole } from '@prisma/client';

export class GuestService {
  static async listGuests(eventId: string) {
    return prisma.guest.findMany({
      where: { eventId },
      include: { ticket: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async addGuest(eventId: string, data: { fullName: string; email?: string; phone?: string; guestRole?: GuestRole }) {
    // Create guest and an associated ticket automatically
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    return prisma.guest.create({
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

  static async getGuestByTicketCode(code: string) {
    const ticket = await prisma.guestTicket.findUnique({
      where: { code },
      include: { guest: true }
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    return ticket.guest;
  }
}
