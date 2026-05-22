import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Permissions() decorator → allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Accès refusé : utilisateur non authentifié');
    }

    // SUPER_ADMIN bypasses all permission checks
    const normalizedRole = user.role.name.toLowerCase().replace(/[\s_-]/g, '');
    if (normalizedRole === 'superadmin') {
      return true;
    }

    // Fetch permissions for this role from DB
    const roleWithPermissions = await this.prisma.role.findUnique({
      where: { id: user.role.id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!roleWithPermissions) {
      throw new ForbiddenException('Rôle introuvable');
    }

    const userPermissions = roleWithPermissions.permissions.map(
      (rp) => rp.permission.key,
    );

    const hasAllPermissions = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Permissions insuffisantes. Requis : ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
