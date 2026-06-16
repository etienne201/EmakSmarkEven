"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUuid = isValidUuid;
exports.sanitizeOwnerId = sanitizeOwnerId;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id) {
    if (!id)
        return false;
    return UUID_REGEX.test(id);
}
function sanitizeOwnerId(ownerId) {
    if (!ownerId || ownerId === "default" || !isValidUuid(ownerId)) {
        return null;
    }
    return ownerId;
}
//# sourceMappingURL=uuid.js.map