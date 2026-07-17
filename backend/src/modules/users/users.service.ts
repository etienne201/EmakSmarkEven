import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PermissionsCacheService } from '../auth/permissions-cache.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionsCacheService: PermissionsCacheService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: { role: true, organization: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true, organization: true },
    });
  }

  async create(dto: any, creator?: any) {
    // 1. Verify email uniqueness
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Un utilisateur avec cette adresse email existe déjà.');
    }

    // 2. Fetch the target role entity
    const role = await this.prisma.role.findUnique({
      where: { id: dto.roleId },
    });
    if (!role) {
      throw new NotFoundException('Rôle ciblé introuvable.');
    }

    // 3. Hash the password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 4. Determine accountType, organizationId and hierarchy trace (createdById)
    let organizationId = dto.organizationId;
    let accountType = dto.accountType || 'INDIVIDUAL';
    let createdById = null;

    if (creator) {
      createdById = creator.id;
      // Normal users inherit organizationId and accountType from their creator
      if (creator.role !== 'SUPER_ADMIN') {
        organizationId = creator.organizationId;
        accountType = creator.accountType;
      } else {
        // Super admin can specify organizationId; accountType is inferred
        if (organizationId) {
          accountType = 'ORGANIZATION';
        } else {
          accountType = 'INDIVIDUAL';
        }
      }
    }

    // 5. Create user
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
        roleId: dto.roleId,
        organizationId: organizationId || null,
        accountType,
        createdById,
        roleOccupied: dto.roleOccupied,
        status: dto.status || 'active',
      },
    });

    // 6. Handle event-staff auto-assignment if roles are event-scoped
    const eventScopedRoles = ['EVENT_ADMIN', 'EVENT_MANAGER', 'STAFF', 'VIEWER'];
    if (
      eventScopedRoles.includes(role.name.toUpperCase()) &&
      dto.eventId
    ) {
      await this.prisma.eventStaff.create({
        data: {
          eventId: dto.eventId,
          userId: newUser.id,
          roleId: role.id,
          assignedById: creator ? creator.id : newUser.id,
        },
      });
    }

    // 7. Invalidate permissions cache
    await this.permissionsCacheService.invalidateUser(newUser.id);

    return newUser;
  }

  async update(id: string, data: any) {
    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    // Invalidate user cache on update
    await this.permissionsCacheService.invalidateUser(id);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.prisma.user.delete({
      where: { id },
    });
    // Invalidate user cache on deletion
    await this.permissionsCacheService.invalidateUser(id);
    return deleted;
  }
}
