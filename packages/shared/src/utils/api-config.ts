/** NestJS backend root (e.g. http://localhost:3001/api/v1) */
export const API_V1_ROOT =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "") +
  "/api/v1";

/**
 * Routes `/api/v1/*` to the NestJS backend; keeps other paths on the Next.js app.
 */
export function resolveApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  if (endpoint.startsWith("/api/v1/")) {
    return `${API_V1_ROOT}${endpoint.slice("/api/v1".length)}`;
  }
  return endpoint;
}

export type AppRole =
  | "super-admin"
  | "owner"
  | "manager"
  | "viewer"
  | "event-admin"
  | "event-manager"
  | "staff"
  | "guest";

/** Maps backend role names (e.g. SUPER_ADMIN) to frontend role slugs. */
export function normalizeRole(role: string | undefined): AppRole {
  const r = (role ?? "").toLowerCase().replace(/_/g, "-");
  if (r === "superadmin" || r === "super-admin") return "super-admin";
  if (r === "owner") return "owner";
  if (r === "manager") return "manager";
  if (r === "viewer") return "viewer";
  if (r === "event-admin" || r === "eventadmin") return "event-admin";
  if (r === "event-manager" || r === "eventmanager") return "event-manager";
  if (r === "staff") return "staff";
  if (r === "guest") return "guest";
  return "guest"; // secure fallback
}

export function isSuperAdminRole(role: string | undefined): boolean {
  return normalizeRole(role) === "super-admin";
}

/** Check if the role has administrative write access (can add/edit guests, tables, configurations). */
export function hasWriteAccess(role: string | undefined): boolean {
  const r = normalizeRole(role);
  return (
    r === "super-admin" ||
    r === "owner" ||
    r === "manager" ||
    r === "event-admin" ||
    r === "event-manager"
  );
}

/** Check if the role is allowed to register check-ins. */
export function canCheckIn(role: string | undefined): boolean {
  const r = normalizeRole(role);
  return r !== "viewer" && r !== "guest";
}

/** Check if the role is allowed to view tables and analytics dashboard tabs. */
export function canViewAnalytics(role: string | undefined): boolean {
  const r = normalizeRole(role);
  return r !== "staff" && r !== "guest";
}
