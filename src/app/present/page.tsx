import { PresenceClient } from "@frontend/components/PresenceClient";
import { DashboardWrapper } from "@frontend/components/dashboard/DashboardWrapper";

export const metadata = {
  title: "Liste des Présences | Danie & John",
  description: "Suivi en temps réel des confirmations d'invités.",
};

export default function PresencePage() {
  return (
    <DashboardWrapper>
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <PresenceClient />
      </div>
    </DashboardWrapper>
  );
}
