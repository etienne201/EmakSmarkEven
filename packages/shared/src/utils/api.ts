import { signalActivity } from "@frontend/hooks/useSessionTimeout";
import Cookies from "js-cookie";
import { resolveApiUrl } from "@frontend/utils/api-config";

function parseErrorMessage(body: Record<string, unknown>): string {
  const raw = body.message;
  if (Array.isArray(raw)) return raw.join(" • ");
  if (typeof raw === "string") return raw;
  if (typeof body.error === "string") return body.error;
  return "Une erreur est survenue";
}

function buildAuthHeaders(options: RequestInit): Headers {
  const token = Cookies.get("auth-token");
  const headers = new Headers(options.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
}

/** Low-level fetch routed to NestJS for `/api/v1/*` paths. */
export async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
  signalActivity();
  const url = resolveApiUrl(endpoint);
  return fetch(url, {
    ...options,
    headers: buildAuthHeaders(options),
    credentials: url.startsWith("http") ? "include" : options.credentials,
  });
}

export async function parseApiJson<T>(
  response: Response,
): Promise<{ data?: T; error?: string; status: number }> {
  let body: Record<string, unknown> = {};
  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  if (!response.ok) {
    return { error: parseErrorMessage(body), status: response.status };
  }

  return { data: (body.data ?? body) as T, status: response.status };
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const response = await fetchApi(endpoint, options);
    return parseApiJson<T>(response);
  } catch {
    return { error: "Erreur de connexion au serveur", status: 500 };
  }
}
