import { useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useScopedStorage } from "./useScopedStorage";
import { EventConfig, DEFAULT_EVENT_CONFIG } from "@backend/eventConfig";
import { Guest, Table } from "@backend/eventConfig";
import { Language } from "@backend/translations";
import Cookies from "js-cookie";

export function useEvent() {
  const [eventConfig, setEventConfig] = useLocalStorage<EventConfig | null>("event-config", null);
  const ownerId = eventConfig?.ownerId || "default";

  const [guests, setGuests] = useScopedStorage<Guest[]>("mariage-guests", [], ownerId);
  const [attendance, setAttendance] = useScopedStorage<any[]>("mariage-attendance", [], ownerId);
  const [appLang, setAppLang] = useLocalStorage<Language>("mariage-app-lang", "fr");
  const [customTables, setCustomTables] = useScopedStorage<Table[]>("mariage-tables", [], ownerId);
  const [isSyncing, setIsSyncing] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const cfg = eventConfig || DEFAULT_EVENT_CONFIG;

  // Use a ref to track ownerId so the callback doesn't need to depend on it
  const ownerIdRef = useRef(ownerId);
  ownerIdRef.current = ownerId;

  const syncData = useCallback(async (isInitial = false) => {
    const token = Cookies.get("auth-token");

    // If there's no token, skip fetching protected routes entirely
    if (!token) {
      if (isInitial) setIsSyncing(false);
      return;
    }

    // Read ownerId directly from localStorage to avoid React state race condition
    // (useLocalStorage may not have hydrated yet on first render)
    let currentOwnerId = ownerIdRef.current;
    try {
      const storedConfig = localStorage.getItem("event-config");
      if (storedConfig) {
        const parsed = JSON.parse(storedConfig);
        if (parsed?.ownerId) currentOwnerId = parsed.ownerId;
      }
    } catch { /* use ref fallback */ }

    const headers = { "Authorization": `Bearer ${token}` };

    try {
      // 1. Fetch Event Config First (Chicken-and-egg fix)
      const confRes = await fetch(`/api/event-config?ownerId=${currentOwnerId}`, { headers });
      if (confRes.status === 403) {
        const err = await confRes.json();
        if (err.isBlocked) {
          setEventConfig((prev: any) => ({ ...prev, isBlocked: true }));
          setIsSyncing(false);
          return;
        }
      } else if (confRes.ok) {
        const json = await confRes.json();
        if (json.data) {
          setEventConfig(json.data);
          currentOwnerId = json.data.ownerId;
        }
      }

      // If we still don't have a valid ownerId, skip fetching private data
      if (!currentOwnerId || currentOwnerId === "default") {
        if (isInitial) setIsSyncing(false);
        return;
      }

      // 2. Fetch Guests
      const resGuests = await fetch(`/api/guests?ownerId=${currentOwnerId}&limit=1000`, { headers });
      if (resGuests.ok) {
        const json = await resGuests.json();
        const rawData = json.data?.items || json.data || json;
        const data = Array.isArray(rawData) ? rawData : [];
        if (data.length > 0 || isInitial) setGuests(data);
      }

      // 2. Tables
      const resTables = await fetch(`/api/tables?ownerId=${currentOwnerId}`, { headers });
      if (resTables.ok) {
        const json = await resTables.json();
        const rawData = json.data?.items || json.data || json;
        const data = Array.isArray(rawData) ? rawData : [];
        if (data.length > 0 || isInitial) setCustomTables(data);
      }

      // 3. Attendance
      const resAtt = await fetch(`/api/attendance?ownerId=${currentOwnerId}&limit=1000`, { headers });
      if (resAtt.ok) {
        const json = await resAtt.json();
        const rawData = json.data?.items || json.data || json;
        const data = Array.isArray(rawData) ? rawData : [];
        if (data.length > 0 || isInitial) setAttendance(data);
      }


      setLastUpdated(new Date());
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      if (isInitial) setIsSyncing(false);
    }
  }, [setGuests, setCustomTables, setEventConfig, setAttendance]);

  useEffect(() => {
    syncData(true);
    const interval = setInterval(() => syncData(), 30000);
    return () => clearInterval(interval);
  }, [syncData]);

  const updateTables = async (newTables: Table[]) => {
    setCustomTables(newTables);
    const token = Cookies.get("auth-token");
    try {
      await fetch("/api/tables", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ownerId, tables: newTables }),
      });
    } catch (err) {
      console.error("Failed to sync tables", err);
    }
  };

  return {
    eventConfig: cfg,
    guests,
    setGuests,
    attendance,
    setAttendance,
    customTables,
    setCustomTables,
    updateTables,
    appLang,
    setAppLang,
    isSyncing,
    lastUpdated,
    ownerId,
    refresh: () => syncData(false)
  };
}
