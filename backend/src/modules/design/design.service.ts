import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DesignService {
  constructor(private prisma: PrismaService) {}

  async findEventThemes(eventId: string) {
    return this.prisma.eventTheme.findMany({ where: { eventId } });
  }

  async findOneTheme(id: string) {
    return this.prisma.eventTheme.findUnique({ where: { id } });
  }

  async createEventTheme(eventId: string, data: any) {
    return this.prisma.eventTheme.create({
      data: { ...data, eventId },
    });
  }

  async updateEventTheme(id: string, data: any) {
    return this.prisma.eventTheme.update({
      where: { id },
      data,
    });
  }

  async deleteEventTheme(id: string) {
    return this.prisma.eventTheme.delete({ where: { id } });
  }

  async getEventDesign(eventId: string) {
    return this.prisma.eventContent.findUnique({
      where: { eventId },
    });
  }

  async updateEventDesign(eventId: string, data: any) {
    return this.prisma.eventContent.upsert({
      where: { eventId },
      update: data,
      create: { ...data, eventId },
    });
  }

  async getAssets(eventId: string) {
    return this.prisma.eventAsset.findMany({
      where: { eventId },
    });
  }

  async createAsset(eventId: string, data: any) {
    return this.prisma.eventAsset.create({
      data: { ...data, eventId },
    });
  }
}
