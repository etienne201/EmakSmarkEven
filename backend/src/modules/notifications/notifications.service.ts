import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async send(dto: any) {
    return this.prisma.notification.create({
      data: {
        type: dto.type,
        title: dto.title,
        content: dto.content,
        userId: dto.userId,
        eventId: dto.eventId,
        sentAt: new Date(),
      },
    });
  }

  async sendBulk(dto: any) {
    const creations = dto.userIds.map((userId: string) => ({
      type: dto.type,
      title: dto.title,
      content: dto.content,
      userId,
      eventId: dto.eventId,
      sentAt: new Date(),
    }));

    return this.prisma.notification.createMany({
      data: creations,
    });
  }
}
