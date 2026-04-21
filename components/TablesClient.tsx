"use client";

import { useState, useEffect } from "react";
import { TableManager, Table } from "@/components/TableManager";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Language } from "@/lib/translations";
import { LoadingScreen } from "@/components/LoadingScreen";

import { useRouter } from "next/navigation";

export function TablesClient() {
  const router = useRouter();
  const [appLang] = useLocalStorage<Language>("mariage-app-lang", "fr");
  const [customTables, setCustomTables] = useLocalStorage<Table[]>("mariage-tables", []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch("/api/tables");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCustomTables(data);
        }
      } catch (err) {
        console.error("Failed to fetch tables:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTables();
  }, [setCustomTables]);

  const handleUpdateTables = async (newTables: Table[] | ((prev: Table[]) => Table[])) => {
    const updated = typeof newTables === "function" ? newTables(customTables) : newTables;
    setCustomTables(updated);
    try {
      await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Failed to sync tables", err);
    }
  };

  if (isLoading) return <LoadingScreen isLoading={true} title="Chargement des tables..." images={[]} />;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gold-light/20 overflow-hidden min-h-[600px] flex flex-col">
      <TableManager 
        isOpen={true} 
        onClose={() => router.push("/")} 
        tables={customTables} 
        onUpdateTables={handleUpdateTables} 
        lang={appLang} 
      />
    </div>
  );
}
