import { TablesClient } from "@frontend/components/TablesClient";
import { DashboardWrapper } from "@frontend/components/dashboard/DashboardWrapper";

export const metadata = {
  title: "Gestion des Tables | Danie & John",
  description: "Organisation du plan de table pour le mariage.",
};

export default function TablesPage() {
  return (
    <DashboardWrapper>
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <TablesClient />
      </div>
    </DashboardWrapper>
  );
}
