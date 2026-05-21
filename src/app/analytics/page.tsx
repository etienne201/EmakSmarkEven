"use client";

import { AnalyticsView } from "@frontend/components/dashboard/AnalyticsView";
import { useEvent } from "@frontend/hooks/useEvent";
import { DashboardWrapper } from "@frontend/components/dashboard/DashboardWrapper";

export default function AnalyticsPage() {
  const {
    guests,
    attendance,
    appLang,
    eventConfig,
  } = useEvent();

  return (
    <DashboardWrapper>
      <AnalyticsView 
        guests={guests || []} 
        attendance={attendance || []} 
        appLang={appLang} 
        eventConfig={eventConfig} 
      />
    </DashboardWrapper>
  );
}
