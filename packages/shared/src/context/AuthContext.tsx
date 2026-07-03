"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSessionTimeout } from "@frontend/hooks/useSessionTimeout";
import { AppRole } from "@frontend/utils/api-config";

export interface User {
  uid: string;
  ownerId: string;
  role: AppRole;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load auth state from cookies/localStorage on mount
  useEffect(() => {
    const savedToken = Cookies.get("auth-token");
    const savedUser = localStorage.getItem("auth-user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        Cookies.remove("auth-token");
        localStorage.removeItem("auth-user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken: string, refreshToken: string, userData: User) => {
    // ── Clear stale event context from any previous session ──
    // Without this, a new admin could inherit another user's event
    // and be redirected to a dashboard that doesn't belong to them.
    localStorage.removeItem("current-event-id");
    localStorage.removeItem("event-config");

    setToken(newToken);
    setUser(userData);
    
    // Set token in cookies for middleware (expires in 24h)
    Cookies.set("auth-token", newToken, { expires: 1, path: "/", sameSite: "Lax" });
    
    // Save other data in localStorage
    localStorage.setItem("refresh-token", refreshToken);
    localStorage.setItem("auth-user", JSON.stringify(userData));

    // Initialise the session-activity timestamp so the inactivity timer
    // starts fresh from the moment of login.
    localStorage.setItem("session-last-activity", Date.now().toString());
  }, []);

  const logout = useCallback(() => {
    // Determine redirect based on current role before clearing
    const currentRole = user?.role;
    setToken(null);
    setUser(null);
    Cookies.remove("auth-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("auth-user");
    localStorage.removeItem("current-event-id");
    localStorage.removeItem("event-config");
    localStorage.removeItem("session-last-activity");
    // Redirect to the appropriate login page based on role
    router.push(currentRole === "super-admin" ? "/login/superadmin" : "/login");
  }, [router, user]);

  // ── Automatic session expiration after 30 min of inactivity ──────
  useSessionTimeout({
    enabled: !!token,
    onExpire: logout,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
