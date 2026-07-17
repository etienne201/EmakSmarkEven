import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { isSuperAdminRole, normalizeRoleKey } from '../auth.types';

@Injectable()
export class EventOwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    // Try to get event ID from request params
    const eventId = request.params.id || request.params.eventId;
    if (!eventId) {
      // If no eventId in parameter, allow access (or skip check)
      return true;
    }

    // Load the event with ownership, parent organization, and explicit staff assignments
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        staffAssignments: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Événement avec l'identifiant ${eventId} introuvable.`);
    }

    const userRole = normalizeRoleKey(user.role);

    // 1. SUPER_ADMIN bypass
    if (isSuperAdminRole(userRole)) {
      return true;
    }

    // 2. INDIVIDUAL Account Type checks
    if (user.accountType === 'INDIVIDUAL') {
      if (event.ownerId !== user.id) {
        throw new ForbiddenException(
          "Accès refusé. En tant que compte individuel, vous devez être le propriétaire de cet événement pour pouvoir le modifier.",
        );
      }
      return true;
    }

    // 3. ORGANIZATION Account Type checks
    if (user.accountType === 'ORGANIZATION') {
      // Event must belong to the user's organization
      if (event.organizationId !== user.organizationId) {
        throw new ForbiddenException(
          "Accès refusé. Cet événement n'appartient pas à votre organisation.",
        );
      }

      // Rôles généraux supervisant tous les événements : OWNER et MANAGER
      if (userRole === 'OWNER' || userRole === 'MANAGER') {
        return true;
      }

      // Rôles spécifiques à portée événementielle : doivent être affectés via EventStaff
      const isAssigned = event.staffAssignments.some(
        (assignment) => assignment.userId === user.id,
      );

      if (!isAssigned) {
        throw new ForbiddenException(
          "Accès refusé. Vous devez être explicitement affecté à cet événement pour pouvoir y accéder ou le modifier.",
        );
      }
    }

    return true;
  }
}
