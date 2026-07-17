// Typed client for the Setup Wizard. Consumes ONLY existing NestJS endpoints
// (events.controller) under the /api/v1 prefix.
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

  getDesignTemplates(eventType?: string) {
    const query = eventType ? `?eventType=${eventType}` : "";
    return request<any[]>(`/design-templates${query}`);
  },

  getDesignAssets(category?: string) {
    const query = category ? `?category=${category}` : "";
    return request<any[]>(`/design-assets${query}`);
  },

  getEventDesigns(eventId: string) {
    return request<any[]>(`/events/${eventId}/designs`);
  },

  createDesign(eventId: string, data: any) {
    return request<any>(`/events/${eventId}/designs`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateDesign(designId: string, data: any) {
    return request<any>(`/designs/${designId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  createDesignExport(designId: string, data: any) {
    return request<any>(`/designs/${designId}/exports`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * BUG-06/07 FIX: Upload une image (logo, bannière, thumbnail) via multipart
   * et retourne une URL publique. Évite de stocker du base64 en DB.
   * Endpoint attendu : POST /uploads (multipart/form-data, champ "file")
   */
  async uploadImage(file: File | Blob, filename?: string): Promise<{ url: string }> {
    const token = Cookies.get("auth-token");
    const form = new FormData();
    form.append("file", file, filename ?? "upload");
    let res: Response;
    try {
      res = await fetch(`${API_ROOT}/uploads`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
    } catch {
      throw { message: "Connexion au serveur impossible.", status: 0 } as ApiError;
    }
    const text = await res.text();
    let body: unknown = null;
    if (text) { try { body = JSON.parse(text); } catch { body = text; } }
    if (!res.ok) {
      const b = (body ?? {}) as Record<string, unknown>;
      throw { message: (b.message as string) || "Échec de l'upload.", status: res.status } as ApiError;
    }
    const b = (body ?? {}) as Record<string, unknown>;
    return ("data" in b ? b.data : b) as { url: string };
  },

  /**
   * BUG-07 FIX: Upload le thumbnail d'un design (JPEG blob) et stocke
   * l'URL résultante sur le design — évite le base64 dans layersData.
   */
  async uploadDesignThumbnail(designId: string, blob: Blob): Promise<{ thumbnailUrl: string }> {
    const { url } = await setupApi.uploadImage(blob, `thumbnail-${designId}.jpg`);
    // Mettre à jour le design avec l'URL du thumbnail
    return request<{ thumbnailUrl: string }>(`/designs/${designId}/thumbnail`, {
      method: "POST",
      body: JSON.stringify({ thumbnailUrl: url }),
    });
  },
};
