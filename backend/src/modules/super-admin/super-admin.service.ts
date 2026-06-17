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

    // Ensure slug uniqueness — append a random suffix if already taken
    let slug = data.organizationSlug;
    const existingOrg = await this.prisma.organization.findUnique({
      where: { slug },
    });
    if (existingOrg) {
      const suffix = Math.random().toString(36).substring(2, 8);
      slug = `${data.organizationSlug}-${suffix}`;
    }

    const organization = await this.prisma.organization.create({
      data: {
        name: data.organizationName,
        slug,
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

    // Link the owner back to the organization (nested create only sets ownerId, not User.organizationId)
    await this.prisma.user.update({
      where: { id: organization.ownerId },
      data: { organizationId: organization.id },
    });

    const emailResult = await this.mailService.sendAdminInvitation(
      data.email,
      data.fullName,
      plainPassword,
      organization.id,
    );

    return { ...organization, emailSent: emailResult.success, emailSimulated: !!emailResult.simulated };
  }
}
