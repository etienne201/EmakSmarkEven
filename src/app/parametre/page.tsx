"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@frontend/components/LoadingScreen";

export default function ParametreRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/reglage");
  }, [router]);

  return <LoadingScreen isLoading={true} title="Redirection..." />;
}
