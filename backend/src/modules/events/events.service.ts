import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId?: string) {
    return this.prisma.event.findMany({
      where: organizationId ? { organizationId } : {},
      include: { sessions: true, guests: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        sessions: {
          include: { sessionSpeakers: { include: { speaker: true } } }
        },
        guests: true,
        sponsors: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.event.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.event.update({
      where: { id },
      data: { status },
    });
  }
}
