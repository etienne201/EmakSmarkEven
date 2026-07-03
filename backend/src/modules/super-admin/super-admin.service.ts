import { Injectable, BadRequestException } from '@nestjs/common';
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

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // remove accents
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async createAdminAccount(data: {
    accountType?: 'entreprise' | 'personnel';
    companyName?: string;
    fullName?: string;
    email?: string;
    roleOccupied?: string;
    passwordHash?: string;
    organizationName?: string;
    organizationSlug?: string;
    role?: string;
  }) {
    let email: string;
    let plainPassword: string;
    let fullName: string;
    let organizationName: string;
    let organizationSlug: string;
    const roleOccupied: string | null = data.roleOccupied || null;
    const isSuperAdmin = data.role === 'super-admin';

    // Auto-generate password
    plainPassword = data.passwordHash || ('Evt-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '@');

    if (isSuperAdmin) {
      if (!data.fullName || !data.email) {
        throw new BadRequestException("Le nom et l'email sont obligatoires pour un compte Super Administrateur.");
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        throw new BadRequestException('Cet email est déjà utilisé par un autre compte.');
      }

      email = data.email;
      fullName = data.fullName;
    } else if (data.accountType) {
      if (data.accountType === 'entreprise') {
        if (!data.companyName) {
          throw new BadRequestException("Le nom de l'entreprise est obligatoire pour un compte Entreprise.");
        }
        organizationName = data.companyName;
        fullName = `Admin ${data.companyName}`;
        
        const baseSlug = this.slugify(data.companyName);
        organizationSlug = baseSlug;
        let existingOrg = await this.prisma.organization.findUnique({
          where: { slug: organizationSlug },
        });
        while (existingOrg) {
          const suffix = Math.random().toString(36).substring(2, 6);
          organizationSlug = `${baseSlug}-${suffix}`;
          existingOrg = await this.prisma.organization.findUnique({
            where: { slug: organizationSlug },
          });
        }

        email = `admin@${organizationSlug}.com`;
      } else {
        // Personnel
        if (!data.fullName || !data.email) {
          throw new BadRequestException("Le nom et l'email sont obligatoires pour un compte Personnel.");
        }
        
        const existingUser = await this.prisma.user.findUnique({
          where: { email: data.email },
        });
        if (existingUser) {
          throw new BadRequestException('Cet email est déjà utilisé par un autre compte.');
        }

        email = data.email;
        fullName = data.fullName;
        organizationName = `Organisation ${data.fullName}`;
        
        const baseSlug = this.slugify(data.fullName);
        organizationSlug = baseSlug;
        let existingOrg = await this.prisma.organization.findUnique({
          where: { slug: organizationSlug },
        });
        while (existingOrg) {
          const suffix = Math.random().toString(36).substring(2, 6);
          organizationSlug = `${baseSlug}-${suffix}`;
          existingOrg = await this.prisma.organization.findUnique({
            where: { slug: organizationSlug },
          });
        }
      }
    } else {
      // Fallback old logic
      if (!data.email || !data.passwordHash || !data.fullName || !data.organizationName || !data.organizationSlug) {
        throw new BadRequestException("Tous les champs sont requis.");
      }
      email = data.email;
      plainPassword = data.passwordHash;
      fullName = data.fullName;
      organizationName = data.organizationName;
      organizationSlug = data.organizationSlug;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    if (isSuperAdmin) {
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          fullName,
          roleOccupied: roleOccupied || 'Super Administrateur',
          role: {
            connect: { name: 'SUPER_ADMIN' },
          },
          status: 'active',
          emailVerified: true,
          accountType: 'INDIVIDUAL',
        },
        include: { role: true },
      });

      const emailResult = await this.mailService.sendAdminInvitation(
        email,
        fullName,
        plainPassword,
        'system',
      );

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        generatedEmail: email,
        generatedPassword: plainPassword,
        emailSent: emailResult.success,
        emailSimulated: !!emailResult.simulated,
      };
    }

    const organization = await this.prisma.organization.create({
      data: {
        name: organizationName,
        slug: organizationSlug,
        owner: {
          create: {
            email,
            passwordHash: hashedPassword,
            fullName,
            roleOccupied,
            role: {
              connect: { name: 'OWNER' },
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
      email,
      fullName,
      plainPassword,
      organization.id,
    );

    return { 
      ...organization,
      generatedEmail: email,
      generatedPassword: plainPassword,
      emailSent: emailResult.success, 
      emailSimulated: !!emailResult.simulated 
    };
  }
}
