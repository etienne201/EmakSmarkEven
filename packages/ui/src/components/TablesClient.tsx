"use client";

import { useState, useEffect } from "react";
import { TableManager } from "@frontend/components/TableManager";
import { Table } from "@backend/eventConfig";
import { useLocalStorage } from "@frontend/hooks/useLocalStorage";
import { Language } from "@backend/translations";
import { LoadingScreen } from "@frontend/components/LoadingScreen";
import Cookies from "js-cookie";
import { fetchApi, parseApiJson } from "@frontend/utils/api";
import { getStoredEventId } from "@frontend/utils/event-api";

import { useRouter } from "next/navigation";

export function TablesClient() {
  const router = useRouter();
  const [appLang] = useLocalStorage<Language>("mariage-app-lang", "fr");
  const [customTables, setCustomTables] = useLocalStorage<Table[]>("mariage-tables", []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      const eventId = getStoredEventId();
      if (!eventId) {
        router.push("/login");
        return;
      }

      try {
        const authToken = Cookies.get("auth-token");
        const res = await fetchApi(`/api/v1/events/${eventId}/tables`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });
        const { data } = await parseApiJson<unknown[]>(res);
        if (Array.isArray(data)) {
          setCustomTables(data as Table[]);
        }
      } catch (err) {
        console.error("Failed to fetch tables:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTables();
  }, [setCustomTables, router]);

  const handleUpdateTables = async (newTables: Table[] | ((prev: Table[]) => Table[])) => {
    const updated = typeof newTables === "function" ? newTables(customTables) : newTables;
    setCustomTables(updated);
    
    const eventId = getStoredEventId();
    if (!eventId) return;

    try {
      const authToken = Cookies.get("auth-token");
      await fetchApi(`/api/v1/events/${eventId}/tables`, {
        method: "POST",
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        body: JSON.stringify({ tables: updated }),
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
