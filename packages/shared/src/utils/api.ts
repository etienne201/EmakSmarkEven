import { signalActivity } from "@frontend/hooks/useSessionTimeout";
import Cookies from "js-cookie";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  // Signal user activity to reset the session inactivity timer.
  signalActivity();

  const token = Cookies.get("auth-token");
  
  const headers = new Headers(options.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const body = await response.json();

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401) {
        // Optional: Implement refresh token logic here
        // For now, just return the error
      }
      return { 
        error: body.message || body.error || "Une erreur est survenue", 
        status: response.status 
      };
    }

    return { data: body.data ?? body, status: response.status };
  } catch (error) {
    return { error: "Erreur de connexion au serveur", status: 500 };
  }
}
