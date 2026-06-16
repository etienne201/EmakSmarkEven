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
export declare function resolveUserRole(user: {
    role?: unknown;
} | null | undefined): string;
export declare function normalizeRoleKey(role: string): string;
export declare function isSuperAdminRole(role: string): boolean;
export declare function roleMatches(userRole: string, requiredRole: string): boolean;
export declare function hasRequiredRole(userRole: string, requiredRoles: string[]): boolean;
export declare function resolveLoginEmail(identifier: string): string;
