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

export type AppRole = "admin" | "super-admin" | "guest" | "staff";

/** Maps backend role names (e.g. SUPER_ADMIN) to frontend role slugs. */
export function normalizeRole(role: string | undefined): AppRole {
  const r = (role ?? "").toLowerCase().replace(/_/g, "-");
  if (r === "superadmin" || r === "super-admin") return "super-admin";
  if (r === "staff") return "staff";
  if (r === "guest") return "guest";
  return "admin";
}

export function isSuperAdminRole(role: string | undefined): boolean {
  return normalizeRole(role) === "super-admin";
}
