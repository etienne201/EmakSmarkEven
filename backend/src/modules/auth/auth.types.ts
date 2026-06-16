export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  organizationId: string | null;
  role: string;
  permissions: string[];
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
