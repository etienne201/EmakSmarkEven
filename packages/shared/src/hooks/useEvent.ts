import { useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useScopedStorage } from "./useScopedStorage";
import { EventConfig, DEFAULT_EVENT_CONFIG } from "@backend/eventConfig";
import { Guest, Table } from "@backend/eventConfig";
import { Language } from "@backend/translations";
import Cookies from "js-cookie";
import {
  ensureEventId,
  getEvent,
  getEventCheckins,
  getEventGuests,
  getEventTables,
  getStoredEventId,
  persistEventContext,
} from "@frontend/utils/event-api";
import { fetchApi } from "@frontend/utils/api";

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

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const eventId = (await ensureEventId(token)) ?? getStoredEventId();
      if (!eventId) {
        if (isInitial) setIsSyncing(false);
        return;
      }

      const eventRes = await getEvent(eventId);
      if (eventRes.data) {
        const ev = eventRes.data as Record<string, unknown>;
        const mapped: EventConfig = {
          ...DEFAULT_EVENT_CONFIG,
          id: String(ev.id ?? eventId),
          eventId: String(ev.id ?? eventId),
          ownerId: String(ev.organizationId ?? ev.slug ?? eventId),
          eventName: String(ev.title ?? ev.eventName ?? ""),
          title: String(ev.title ?? ""),
          eventType: (ev.eventType as EventConfig["eventType"]) ?? DEFAULT_EVENT_CONFIG.eventType,
          status: (ev.status as EventConfig["status"]) ?? DEFAULT_EVENT_CONFIG.status,
        };
        setEventConfig(mapped);
        persistEventContext(eventId);
        currentOwnerId = mapped.ownerId;
      }

      const guestsRes = await getEventGuests(eventId);
      if (guestsRes.data) {
        const data = Array.isArray(guestsRes.data) ? guestsRes.data : [];
        if (data.length > 0 || isInitial) setGuests(data as Guest[]);
      }

      const tablesRes = await getEventTables(eventId);
      if (tablesRes.data) {
        const data = Array.isArray(tablesRes.data) ? tablesRes.data : [];
        if (data.length > 0 || isInitial) setCustomTables(data as Table[]);
      }

      const checkinsRes = await getEventCheckins(eventId);
      if (checkinsRes.data) {
        const data = Array.isArray(checkinsRes.data) ? checkinsRes.data : [];
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
    const eventId = getStoredEventId();
    if (!eventId) return;
    try {
      await fetchApi(`/api/v1/events/${eventId}/tables`, {
        method: "POST",
        body: JSON.stringify({ tables: newTables }),
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
