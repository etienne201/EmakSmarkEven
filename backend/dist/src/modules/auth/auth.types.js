"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveUserRole = resolveUserRole;
exports.normalizeRoleKey = normalizeRoleKey;
exports.isSuperAdminRole = isSuperAdminRole;
exports.roleMatches = roleMatches;
exports.hasRequiredRole = hasRequiredRole;
exports.resolveLoginEmail = resolveLoginEmail;
function resolveUserRole(user) {
    const role = user?.role;
    if (typeof role === 'string')
        return role;
    if (role && typeof role === 'object' && 'name' in role) {
        return String(role.name);
    }
    return '';
}
function normalizeRoleKey(role) {
    return role.trim().toUpperCase().replace(/[\s-]+/g, '_');
}
function isSuperAdminRole(role) {
    return normalizeRoleKey(role) === 'SUPER_ADMIN';
}
function roleMatches(userRole, requiredRole) {
    return normalizeRoleKey(userRole) === normalizeRoleKey(requiredRole);
}
function hasRequiredRole(userRole, requiredRoles) {
    if (isSuperAdminRole(userRole))
        return true;
    return requiredRoles.some((required) => roleMatches(userRole, required));
}
const LOGIN_ALIASES = {
    usereven: 'usereven@smartevent.com',
    UserEven: 'usereven@smartevent.com',
};
function resolveLoginEmail(identifier) {
    const trimmed = identifier.trim();
    if (LOGIN_ALIASES[trimmed])
        return LOGIN_ALIASES[trimmed];
    if (trimmed.includes('@'))
        return trimmed.toLowerCase();
    return `${trimmed.toLowerCase()}@smartevent.com`;
}
//# sourceMappingURL=auth.types.js.map