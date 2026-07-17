import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { hasRequiredRole, resolveUserRole } from '../auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<
        string[]
      >(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // no roles required → allow
    if (!requiredRoles?.length) {
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

    if (!hasRequiredRole(userRole, requiredRoles)) {
      throw new ForbiddenException(
        `Accès refusé. Rôle requis: ${requiredRoles.join(
          ', ',
        )}`,
      );
    }

    return true;
  }
}