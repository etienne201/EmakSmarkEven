"use client";
import { SuperAdminLoginUI } from "@frontend/components/superadmin/SuperAdminLoginUI";
import { useAuth } from "@frontend/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminLoginPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.role === "super-admin") {
      router.replace("/superadmin");
    }
  }, [isAuthenticated, user, router]);

  return <SuperAdminLoginUI />;
}
