"use client";

import { PresenceView } from "@frontend/components/dashboard/PresenceView";
import { DashboardWrapper } from "@frontend/components/dashboard/DashboardWrapper";
import { useEvent } from "@frontend/hooks/useEvent";
import { useRouter } from "next/navigation";

export default function PresencePage() {
  const { appLang } = useEvent();
  const router = useRouter();

  return (
    <DashboardWrapper>
      <PresenceView
        appLang={appLang}
        onClose={() => router.push("/home")}
      />
    </DashboardWrapper>
  );
}
