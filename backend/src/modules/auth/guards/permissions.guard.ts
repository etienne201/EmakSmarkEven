import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { isSuperAdminRole, resolveUserRole } from '../auth.types';

@Injectable()
export class PermissionsGuard
  implements CanActivate
{
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<
        string[]
      >(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // no permissions required
    if (!requiredPermissions?.length) {
      return true;
    }

    const { user } =
      context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException(
        'Utilisateur non authentifié',
      );
    }

    const userRole = resolveUserRole(user);

    // SUPER ADMIN bypass (seed assigns all permissions)
    if (isSuperAdminRole(userRole)) {
      return true;
    }

    const userPermissions: string[] =
      Array.isArray(user.permissions) ? user.permissions : [];

    const hasPermission =
      requiredPermissions.every((perm) =>
        userPermissions.includes(perm),
      );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Permissions insuffisantes. Requis: ${requiredPermissions.join(
          ', ',
        )}`,
      );
    }

    return true;
  }
}