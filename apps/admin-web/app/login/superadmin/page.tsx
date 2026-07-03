"use client";

import { SuperAdminLoginUI } from "@frontend/components/superadmin/SuperAdminLoginUI";
import { useAuth } from "@frontend/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuperAdminLoginPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated && user?.role === "super-admin") {
      const targetUrl = window.location.port === "3000"
        ? `http://${window.location.hostname}:3002/superadmin`
        : "/superadmin";
      window.location.href = targetUrl;
    }
  }, [isAuthenticated, user]);

  return <SuperAdminLoginUI />;
}
