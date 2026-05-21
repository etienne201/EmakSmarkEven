"use client";

import { useState, useEffect } from "react";
import { TableManager } from "@frontend/components/TableManager";
import { Table } from "@backend/eventConfig";
import { useLocalStorage } from "@frontend/hooks/useLocalStorage";
import { Language } from "@backend/translations";
import { LoadingScreen } from "@frontend/components/LoadingScreen";
import Cookies from "js-cookie";

import { useRouter } from "next/navigation";

export function TablesClient() {
  const router = useRouter();
  const [appLang] = useLocalStorage<Language>("mariage-app-lang", "fr");
  const [customTables, setCustomTables] = useLocalStorage<Table[]>("mariage-tables", []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      const configStr = localStorage.getItem("event-config");
      if (!configStr) {
        router.push("/login");
        return;
      }
      const configObj = JSON.parse(configStr);
      const ownerId = configObj.ownerId || "default";
      const password = configObj.adminPassword || "";

      try {
        const authToken = Cookies.get("auth-token");
        const res = await fetch(`/api/tables?ownerId=${ownerId}`, {
          headers: { 
            ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
            "x-event-password": password 
          }
        });
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
  }, [setCustomTables, router]);

  const handleUpdateTables = async (newTables: Table[] | ((prev: Table[]) => Table[])) => {
    const updated = typeof newTables === "function" ? newTables(customTables) : newTables;
    setCustomTables(updated);
    
    const configStr = localStorage.getItem("event-config");
    const configObj = configStr ? JSON.parse(configStr) : null;
    const ownerId = configObj?.ownerId || "default";
    const password = configObj?.adminPassword || "";
    
    try {
      const authToken = Cookies.get("auth-token");
      await fetch("/api/tables", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
          "x-event-password": password 
        },
        body: JSON.stringify({ ownerId, tables: updated }),
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
