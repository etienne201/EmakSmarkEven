export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  organizationId: string | null;
  role: string;
  permissions: string[];
  accountType: 'INDIVIDUAL' | 'ORGANIZATION';
  organization?: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  } | null;
}

export function resolveUserRole(user: { role?: unknown } | null | undefined): string {
  const role = user?.role;
  if (typeof role === 'string') return role;
  if (role && typeof role === 'object' && 'name' in role) {
    return String((role as { name: string }).name);
  }
  return '';
}

export function normalizeRoleKey(role: string): string {
  return role.trim().toUpperCase().replace(/[\s-]+/g, '_');
}

export function isSuperAdminRole(role: string): boolean {
  return normalizeRoleKey(role) === 'SUPER_ADMIN';
}

export function roleMatches(userRole: string, requiredRole: string): boolean {
  return normalizeRoleKey(userRole) === normalizeRoleKey(requiredRole);
}

export function hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
  if (isSuperAdminRole(userRole)) return true;
  return requiredRoles.some((required) => roleMatches(userRole, required));
}

/** Maps legacy login identifiers (e.g. UserEven) to canonical emails. */
const LOGIN_ALIASES: Record<string, string> = {
  usereven: 'usereven@smartevent.com',
  UserEven: 'usereven@smartevent.com',
};

export function resolveLoginEmail(identifier: string): string {
  const trimmed = identifier.trim();
  if (LOGIN_ALIASES[trimmed]) return LOGIN_ALIASES[trimmed];
  if (trimmed.includes('@')) return trimmed.toLowerCase();
  return `${trimmed.toLowerCase()}@smartevent.com`;
}

export const STANDARD_QUOTAS: Record<string, number> = {
  STAFF: 10,
  MANAGER: 3,
};

export function canCreateUserRole(
  creatorAccountType: 'INDIVIDUAL' | 'ORGANIZATION',
  creatorRole: string,
  targetRole: string,
): { allowed: boolean; reason?: string } {
  const normCreator = normalizeRoleKey(creatorRole);
  const normTarget = normalizeRoleKey(targetRole);

  if (normCreator === 'SUPER_ADMIN') {
    return { allowed: true };
  }

  // Seuls les rôles OWNER et MANAGER ont le droit de créer des comptes
  if (normCreator !== 'OWNER' && normCreator !== 'MANAGER') {
    return {
      allowed: false,
      reason: "Accès refusé. Seuls les rôles OWNER et MANAGER de l'organisation ont le droit de créer des comptes.",
    };
  }

  // Table de correspondance selon le type de compte
  if (creatorAccountType === 'INDIVIDUAL') {
    if (normTarget !== 'GUEST') {
      return {
        allowed: false,
        reason: "Un compte individuel ne peut créer que des invités (GUEST).",
      };
    }
  } else if (creatorAccountType === 'ORGANIZATION') {
    const allowedRoles = ['MANAGER', 'EVENT_ADMIN', 'EVENT_MANAGER', 'STAFF', 'VIEWER', 'GUEST'];
    if (!allowedRoles.includes(normTarget)) {
      return {
        allowed: false,
        reason: `Le type de compte organisation ne permet pas d'attribuer le rôle ${targetRole}.`,
      };
    }
  }

  // Règle supplémentaire : un MANAGER ne peut pas créer un autre MANAGER
  if (normCreator === 'MANAGER' && normTarget === 'MANAGER') {
    return {
      allowed: false,
      reason: "Règle de cascade : un gestionnaire (MANAGER) n'est pas autorisé à créer un autre gestionnaire.",
    };
  }

  return { allowed: true };
}
