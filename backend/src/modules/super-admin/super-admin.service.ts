import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SuperAdminService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

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

  async createAdminAccount(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    organizationName: string;
    organizationSlug: string;
  }) {
    const plainPassword = data.passwordHash;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const organization = await this.prisma.organization.create({
      data: {
        name: data.organizationName,
        slug: data.organizationSlug,
        owner: {
          create: {
            email: data.email,
            passwordHash: hashedPassword,
            fullName: data.fullName,
            role: {
              connect: { name: 'ADMIN' },
            },
          },
        },
      },
      include: { owner: true },
    });

    const emailResult = await this.mailService.sendAdminInvitation(
      data.email,
      data.fullName,
      plainPassword,
      data.organizationSlug,
    );

    return { ...organization, emailSent: emailResult.success, emailSimulated: !!emailResult.simulated };
  }
}
