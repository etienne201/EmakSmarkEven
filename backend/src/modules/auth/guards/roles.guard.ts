import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // getAllAndOverride checks BOTH handler-level AND class-level @Roles()
    // Method-level takes priority over class-level
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() decorator → allow access (only JWT auth required)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // If no user attached (JwtAuthGuard failed or missing), deny
    if (!user || !user.role) {
      throw new ForbiddenException('Accès refusé : utilisateur non authentifié ou rôle manquant');
    }

    // Normalized comparison (ignores spaces, underscores, dashes, and case)
    // e.g. 'Super Admin' === 'SUPER_ADMIN' === 'super-admin'
    const normalizedUser = user.role.name.toLowerCase().replace(/[\s_-]/g, '');

    const hasRole = requiredRoles.some((role) => {
      const normalizedReq = role.toLowerCase().replace(/[\s_-]/g, '');
      return normalizedUser === normalizedReq;
    });

    if (!hasRole) {
      throw new ForbiddenException(
        `Accès refusé : le rôle "${user.role.name}" n'est pas autorisé. Rôles requis : ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
