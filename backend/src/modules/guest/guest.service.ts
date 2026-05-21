import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GuestService {
  constructor(private prisma: PrismaService) {}

  async findAll(eventId: string) {
    return this.prisma.guest.findMany({
      where: { eventId },
    });
  }

  async findOne(id: string) {
    return this.prisma.guest.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.guest.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.guest.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.guest.delete({
      where: { id },
    });
  }

  async importGuests(eventId: string, file: any) {
    // Logic for CSV/Excel import
    return { imported: 0 };
  }

  async exportGuests(eventId: string) {
    // Logic for CSV/Excel export
    return { url: 'link-to-file' };
  }

  async rsvp(id: string, data: any) {
    return this.prisma.guest.update({
      where: { id },
      data: {
        status: data.status,
        // other RSVP fields
      },
    });
  }
}
