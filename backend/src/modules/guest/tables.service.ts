import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async findAll(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { metadata: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const metadata = (event.metadata as Record<string, any>) || {};
    return metadata.tables || [];
  }

  async updateTables(eventId: string, tables: any[]) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { metadata: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const currentMeta = (event.metadata as Record<string, any>) || {};
    const updatedMeta = {
      ...currentMeta,
      tables,
    };

    const updatedEvent = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        metadata: updatedMeta,
      },
      select: { metadata: true },
    });

    const metadata = (updatedEvent.metadata as Record<string, any>) || {};
    return metadata.tables || [];
  }
}
