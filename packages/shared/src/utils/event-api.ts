import { apiRequest, fetchApi, parseApiJson } from "@frontend/utils/api";
import { resolveApiUrl } from "@frontend/utils/api-config";

const EVENT_ID_KEY = "current-event-id";

export interface SetupStatusResponse {
  eventId: string;
  setupCompleted?: boolean;
  status?: string;
  currentStep?: number;
  steps?: Record<string, unknown>;
}

export function getStoredEventId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const direct = localStorage.getItem(EVENT_ID_KEY);
    if (direct) return direct;
    const stored = localStorage.getItem("event-config");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.id ?? parsed?.eventId ?? null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function persistEventContext(eventId: string, status?: SetupStatusResponse | null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EVENT_ID_KEY, eventId);
  const existing = (() => {
    try {
      const raw = localStorage.getItem("event-config");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();
  localStorage.setItem(
    "event-config",
    JSON.stringify({
      ...existing,
      id: eventId,
      eventId,
      ownerId: existing.ownerId ?? eventId,
      setupCompleted: status?.setupCompleted ?? existing.setupCompleted,
      status: status?.status ?? existing.status,
    }),
  );
}

export async function listEvents(token?: string) {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  return apiRequest<unknown[]>("/api/v1/events", { headers });
}

export async function getPrimaryEventId(token?: string): Promise<string | null> {
  const { data } = await listEvents(token);
  const events = (Array.isArray(data) ? data : []) as Array<{ id?: string }>;

  const stored = getStoredEventId();
  if (stored) {
    // Validate that the stored event actually belongs to this user
    const ownsStored = events.some((e) => e.id === stored);
    if (ownsStored) return stored;

    // Stale event from another user — clear it
    if (typeof window !== "undefined") {
      localStorage.removeItem("current-event-id");
      localStorage.removeItem("event-config");
    }
  }

  if (events.length === 0) return null;

  return events[0].id ?? null;
}

export async function ensureEventId(token?: string): Promise<string | null> {
  const id = await getPrimaryEventId(token);
  if (id) persistEventContext(id);
  return id;
}

export async function getSetupStatus(
  eventId: string,
  token?: string,
): Promise<SetupStatusResponse | null> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await apiRequest<SetupStatusResponse>(
    `/api/v1/events/${eventId}/setup/status`,
    { headers },
  );
  return data ?? null;
}

export async function isEventConfigured(eventId: string, token?: string): Promise<boolean> {
  const status = await getSetupStatus(eventId, token);
  if (!status) return false;
  return status.setupCompleted === true;
}

export async function getEvent(eventId: string) {
  return apiRequest<Record<string, unknown>>(`/api/v1/events/${eventId}`);
}

export async function updateEvent(eventId: string, body: Record<string, unknown>) {
  return apiRequest(`/api/v1/events/${eventId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function getEventGuests(eventId: string) {
  return apiRequest<unknown[]>(`/api/v1/events/${eventId}/guests`);
}

export async function createGuest(eventId: string, body: Record<string, unknown>) {
  return apiRequest(`/api/v1/events/${eventId}/guests`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function deleteGuest(guestId: string) {
  return apiRequest(`/api/v1/guests/${guestId}`, { method: "DELETE" });
}

export async function getEventTables(eventId: string) {
  return apiRequest<unknown[]>(`/api/v1/events/${eventId}/tables`);
}

export async function getEventCheckins(eventId: string) {
  return apiRequest<unknown[]>(`/api/v1/events/${eventId}/checkins`);
}

/** Raw fetch helper for components that need the Response object. */
export function eventApiUrl(path: string): string {
  return resolveApiUrl(path);
}

export { fetchApi, parseApiJson };
