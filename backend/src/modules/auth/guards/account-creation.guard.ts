import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../database/prisma.service';
import { TARGET_ROLE_FIELD_KEY } from '../decorators/target-role-field.decorator';
import { canCreateUserRole, isSuperAdminRole, normalizeRoleKey, STANDARD_QUOTAS } from '../auth.types';

@Injectable()
export class AccountCreationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targetRoleFieldName = this.reflector.get<string>(
      TARGET_ROLE_FIELD_KEY,
      context.getHandler(),
    );

    // If no decorator is defined, we default to checking 'roleId'
    const fieldName = targetRoleFieldName || 'roleId';

    const request = context.switchToHttp().getRequest();
    const creator = request.user;

    if (!creator) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    const targetRoleIdOrName = request.body[fieldName];
    if (!targetRoleIdOrName) {
      throw new BadRequestException(
        `Le champ contenant le rôle ciblé ("${fieldName}") est manquant dans la requête.`,
      );
    }

    // Resolve target role from database (could be ID or name)
    const targetRoleEntity = await this.prisma.role.findFirst({
      where: {
        OR: [
          { id: targetRoleIdOrName },
          { name: { equals: targetRoleIdOrName, mode: 'insensitive' } },
        ],
      },
    });

    if (!targetRoleEntity) {
      throw new BadRequestException(`Rôle ciblé introuvable: ${targetRoleIdOrName}`);
    }

    // Super admins bypass all role mapping and quota checks
    if (isSuperAdminRole(creator.role)) {
      return true;
    }

    // Verify creator rights to assign this role
    const verification = canCreateUserRole(
      creator.accountType,
      creator.role,
      targetRoleEntity.name,
    );

    if (!verification.allowed) {
      throw new ForbiddenException(verification.reason);
    }

    // Quotas check
    const normalizedTargetRole = normalizeRoleKey(targetRoleEntity.name);
    const quotaLimit = STANDARD_QUOTAS[normalizedTargetRole];

    if (quotaLimit !== undefined) {
      if (!creator.organizationId) {
        throw new ForbiddenException(
          `Vous devez être rattaché à une organisation pour créer un compte de rôle ${targetRoleEntity.name}.`,
        );
      }

      // Count active users with this role in the organization
      const activeCount = await this.prisma.user.count({
        where: {
          organizationId: creator.organizationId,
          role: {
            name: {
              equals: targetRoleEntity.name,
              mode: 'insensitive',
            },
          },
          status: 'active',
        },
      });

      if (activeCount >= quotaLimit) {
        throw new ForbiddenException(
          `Le quota pour le rôle ${targetRoleEntity.name} (${quotaLimit} comptes maximum) est atteint pour votre organisation. Veuillez mettre à niveau votre plan.`,
        );
      }
    }

    return true;
  }
}
