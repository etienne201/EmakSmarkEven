import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    const totalOrganizations = await this.prisma.organization.count();
    const totalUsers = await this.prisma.user.count();
    const totalEvents = await this.prisma.event.count();
    return { totalOrganizations, totalUsers, totalEvents };
  }

  async getAllAdmins() {
    return this.prisma.user.findMany({
      include: { organization: true, role: true },
    });
  }

  async blockOrganization(id: string) {
    return this.prisma.organization.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getAllSystemLogs() {
    // Assuming ActivityLog is for system logs
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async createAdminAccount(data: { email: string; passwordHash: string; fullName: string; organizationName: string; organizationSlug: string }) {
    // 1. Create Organization
    const organization = await this.prisma.organization.create({
      data: {
        name: data.organizationName,
        slug: data.organizationSlug,
        // In a real app, the ownerId will be the user we're about to create
        // But Prisma needs one first. We'll use a hack or a better transaction.
        // Let's find the 'Admin' role ID first
        owner: {
           create: {
             email: data.email,
             passwordHash: data.passwordHash,
             fullName: data.fullName,
             role: {
                connect: { name: 'Admin' } // Assuming 'Admin' role exists
             }
           }
        }
      },
      include: { owner: true }
    });
    
    // Update organization owner link if needed (Prisma handles it via connect/create)
    return organization;
  }
}
