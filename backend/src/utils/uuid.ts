const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(id: string | null | undefined): boolean {
  if (!id) return false;
  return UUID_REGEX.test(id);
}

export function sanitizeOwnerId(ownerId: string | null | undefined): string | null {
  if (!ownerId || ownerId === "default" || !isValidUuid(ownerId)) {
    return null;
  }
  return ownerId;
}
