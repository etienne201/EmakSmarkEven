// Typed client for the Setup Wizard. Consumes ONLY existing NestJS endpoints
// (events.controller) under the /api/v1 prefix. No new endpoints are introduced.
import Cookies from "js-cookie";
import { API_V1_ROOT } from "@frontend/utils/api-config";
import type {
  SetupStatus,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
  ModulesMap,
  ApiError,
  EventTypeKey,
} from "./types";

const API_ROOT = API_V1_ROOT;

function authHeaders(): HeadersInit {
  const token = Cookies.get("auth-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_ROOT}${path}`, {
      ...init,
      headers: { ...authHeaders(), ...(init.headers ?? {}) },
    });
  } catch {
    const err: ApiError = {
      message: "Connexion au serveur impossible.",
      status: 0,
    };
    throw err;
  }

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const b = (body ?? {}) as Record<string, unknown>;
    const raw = b.message;
    const fieldMessages = Array.isArray(raw) ? (raw as string[]) : undefined;
    const message =
      (fieldMessages ? fieldMessages.join(" • ") : (raw as string)) ||
      (b.error as string) ||
      "Une erreur est survenue.";
    const err: ApiError = { message, fieldMessages, status: res.status };
    throw err;
  }

  // The backend wraps successful payloads as { success, data }.
  const b = (body ?? {}) as Record<string, unknown>;
  return (("data" in b ? b.data : b) as T);
}

export interface CreateEventInput {
  title: string;
  slug: string;
  eventType: EventTypeKey;
  startDate: string;
}

export const setupApi = {
  createEvent(input: CreateEventInput) {
    return request<{ id: string }>("/events", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getStatus(eventId: string) {
    return request<SetupStatus>(`/events/${eventId}/setup/status`);
  },

  saveStep(
    eventId: string,
    step: number,
    data: Step1Data | Step2Data | Step3Data | Step4Data | Step5Data,
  ) {
    return request<SetupStatus>(`/events/${eventId}/setup/step/${step}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateModules(eventId: string, modules: ModulesMap) {
    return request<ModulesMap>(`/events/${eventId}/modules`, {
      method: "PUT",
      body: JSON.stringify({ modules }),
    });
  },

  finalize(eventId: string) {
    return request<SetupStatus>(`/events/${eventId}/setup/finalize`, {
      method: "POST",
    });
  },

  submitForReview(eventId: string) {
    return request<unknown>(`/events/${eventId}/workflow/review`, {
      method: "POST",
    });
  },

  publish(eventId: string) {
    return request<unknown>(`/events/${eventId}/workflow/publish`, {
      method: "POST",
    });
  },
};
