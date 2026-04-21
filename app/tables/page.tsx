import { TablesClient } from "@/components/TablesClient";

export const metadata = {
  title: "Gestion des Tables | Danie & John",
  description: "Organisation du plan de table pour le mariage.",
};

export default function TablesPage() {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      <TablesClient />
    </main>
  );
}
