import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(eventId: string) {
    const views = await this.prisma.activityLog.count({
      where: { eventId, action: 'VIEW' },
    });
    const checkins = await this.prisma.guest.count({
      where: { eventId, status: 'checked_in' },
    });
    return { views, checkins };
  }

  async getViews(eventId: string) {
    return this.prisma.activityLog.findMany({
      where: { eventId, action: 'VIEW' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCheckins(eventId: string) {
    return this.prisma.guest.findMany({
      where: { eventId, status: 'checked_in' },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getEngagement(eventId: string) {
    // Logique simplifiée pour l'engagement
    return {
      rate: 0.75,
      totalInteractions: 150,
    };
  }

  async getGuestsAnalysis(eventId: string) {
    return this.prisma.guest.groupBy({
      by: ['status'],
      where: { eventId },
      _count: true,
    });
  }
}
