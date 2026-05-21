import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PlatformService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    return this.prisma.platformSetting.findMany();
  }

  async updateSetting(key: string, value: string) {
    return this.prisma.platformSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async getHealth() {
    return { status: 'OK', timestamp: new Date() };
  }

  async findAllTemplates() {
    return this.prisma.template.findMany();
  }

  async createTemplate(data: any) {
    return this.prisma.template.create({ data });
  }

  async findAllWebhooks(orgId: string) {
    return this.prisma.webhook.findMany({ where: { organizationId: orgId } });
  }

  async createWebhook(orgId: string, data: any) {
    return this.prisma.webhook.create({
      data: { ...data, organizationId: orgId },
    });
  }

  async findAllApiKeys(orgId: string) {
    return this.prisma.apiKey.findMany({ where: { organizationId: orgId } });
  }

  async createApiKey(orgId: string, name: string) {
    return this.prisma.apiKey.create({
      data: {
        name,
        keyHash: `sk_${Math.random().toString(36).substring(7)}`,
        organizationId: orgId,
      },
    });
  }

  async getAuditLogs() {
    return this.prisma.securityAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
