import { apiRequest } from "@frontend/utils/api";
import { isSuperAdminRole, normalizeRole } from "@frontend/utils/api-config";
import type { User } from "@frontend/context/AuthContext";
import { getPrimaryEventId, getSetupStatus, persistEventContext } from "@frontend/utils/event-api";

export interface LoginPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export function mapLoginUser(userObj: Record<string, unknown>): User {
  return {
    uid: String(userObj.uid ?? userObj.id ?? ""),
    ownerId: String(userObj.ownerId ?? userObj.organizationId ?? userObj.id ?? "system"),
    role: normalizeRole(String(userObj.role ?? "admin")),
    email: userObj.email ? String(userObj.email) : undefined,
    name: String(
      userObj.name ?? userObj.fullName ?? (userObj.email ? String(userObj.email).split("@")[0] : "Utilisateur"),
    ),
  };
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<{ data?: LoginPayload; error?: string; status: number }> {
  const { data, error, status } = await apiRequest<Record<string, unknown>>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!data) return { error: error || "Identifiants invalides", status };

  const userObj = (data.user ?? data) as Record<string, unknown>;
  const user = mapLoginUser(userObj);

  return {
    data: {
      user,
      accessToken: String(data.accessToken ?? data.token ?? ""),
      refreshToken: String(data.refreshToken ?? ""),
    },
    status,
  };
}

export async function logoutFromBackend(): Promise<void> {
  try {
    await apiRequest("/api/v1/auth/sessions/revoke-all", { method: "DELETE" });
  } catch {
    // Client-side cleanup still runs even if the API call fails.
  }
}

export async function getUserProfile() {
  return apiRequest<Record<string, unknown>>("/api/v1/users/profile");
}

export async function updateUserProfile(body: Record<string, unknown>) {
  return apiRequest("/api/v1/users/profile", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/** Resolves post-login redirect for organizer accounts. */
export async function resolveOrganizerRedirect(accessToken: string): Promise<string> {
  const eventId = await getPrimaryEventId(accessToken);
  if (!eventId) return "/setup?welcome=true";

  const status = await getSetupStatus(eventId, accessToken);
  if (!status) return `/setup?eventId=${eventId}`;

  persistEventContext(eventId, status);

  if (status.setupCompleted) return "/home?welcome=true";
  return `/setup?eventId=${eventId}&welcome=true`;
}

export { isSuperAdminRole, normalizeRole };
