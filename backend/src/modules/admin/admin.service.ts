import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

import { CreateGuestDto } from '../guest/dto/create-guest.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getEventStats(eventId: string) {
    const totalGuests = await this.prisma.guest.count({ where: { eventId } });
    const confirmedGuests = await this.prisma.guest.count({ where: { eventId, status: 'confirmed' } });
    const checkedInGuests = await this.prisma.guest.count({ where: { eventId, status: 'checked_in' } });
    
    return { totalGuests, confirmedGuests, checkedInGuests };
  }

  async getGuests(eventId: string) {
    return this.prisma.guest.findMany({
      where: { eventId },
      include: { ticket: true },
    });
  }

  async updateEventConfig(eventId: string, data: any) {
    return this.prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

  async addGuest(eventId: string, guestData: CreateGuestDto) {
    return this.prisma.guest.create({
      data: {
        ...guestData,
        eventId,
      },
    });
  }
}
