"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Calendar, UtensilsCrossed, CheckCircle2, ListOrdered, UserCheck } from "lucide-react";
import { AttendanceScreen } from "@frontend/components/AttendanceModal";
import { LoadingScreen } from "@frontend/components/LoadingScreen";
import { FloatingDecorations } from "@frontend/components/FloatingDecorations";
import { GuestNavDots } from "@frontend/components/GuestNavDots";
import { EventTimeline } from "@frontend/components/EventTimeline";
import { translations, Language } from "@backend/translations";
import { CanvasElement } from "@backend/eventConfig";
import { useToast } from "@frontend/hooks/useToast";
import { useSmartDesignStore } from "@frontend/store/useSmartDesignStore";
import dynamic from "next/dynamic";

const SmartCanvas = dynamic(
  () => import("@frontend/components/design/SmartCanvas").then(m => m.SmartCanvas),
  { ssr: false }
);

const GUEST_FETCH_TIMEOUT = 7000;

type AttendanceOption = {
  id: string;
  enabled: boolean;
};

type Session = {
  id: string;
  name?: string;
  title?: string;
  startTime?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  venue?: string;
  details?: string;
  description?: string;
};

type GuestInvitationData = {
  id: string;
  title?: string;
  name?: string;
  fullName?: string;
  table?: number | string;
  tableName?: string;
  lang?: Language;
  smartDesign?: {
    templateId?: string;
    dynamicValues?: Record<string, string>;
    layoutElements?: CanvasElement[];
  };
  layoutElements?: CanvasElement[];
  attendanceStatus?: string | null;
  checkinStatus?: string | null;
  attendanceOptions?: AttendanceOption[];
  logoUrl?: string;
  eventInfo?: {
    eventType?: string;
    startDate?: string;
    location?: string;
    city?: string;
    title?: string;
  };
  eventSessions?: Session[];
  ceremonies?: Session[];
  configSessions?: Session[];
};

const getAdminOrigin = () => {
  if (typeof window === "undefined") return "";
  return window.location.origin.includes("localhost") ? "http://localhost:3000" : "";
};

function GuestContent() {
  const searchParams = useSearchParams();
  const guestId = searchParams.get("id");
  const [data, setData] = useState<GuestInvitationData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [visitedSections, setVisitedSections] = useState<Record<number, boolean>>({ 0: true });
  const [transitionDirection, setTransitionDirection] = useState<"forward" | "backward">("forward");
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!guestId) {
      setFetchError("Lien invalide. Impossible de trouver votre invitation.");
      setIsPageLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
      setFetchError("Le serveur ne répond pas. Vérifiez votre connexion ou réessayez.");
      setIsPageLoading(false);
    }, GUEST_FETCH_TIMEOUT);

    const fetchGuest = async () => {
      try {
        const adminOrigin = getAdminOrigin();
        const response = await fetch(`${adminOrigin}/api/public/guest/${guestId}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Erreur ${response.status} : ${response.statusText}`);
        }

        const payload = await response.json();
        if (!payload?.success || !payload?.data) {
          throw new Error(payload?.error || "Impossible de charger l'invitation.");
        }

        const guestData = payload.data as GuestInvitationData;
        setData(guestData);
        setFetchError(null);

        if (guestData.smartDesign?.templateId) {
          const store = useSmartDesignStore.getState();
          store.setTemplate(guestData.smartDesign.templateId);
          const customValues = {
            ...(guestData.smartDesign.dynamicValues || {}),
            g_name: guestData.fullName || "",
            g_table: (!guestData.tableName || guestData.tableName === "Non assignée" || guestData.tableName === "Unassigned")
              ? (guestData.table || "Sans Table")
              : (guestData.tableName.toLowerCase().startsWith("table") ? guestData.tableName : `Table ${guestData.tableName}`),
            rsvpQr: `${window.location.origin}/present?guestId=${guestData.id}`,
          };

          Object.entries(customValues).forEach(([key, value]) => {
            store.updateDynamicValue(key, String(value ?? ""));
          });

          if (guestData.layoutElements?.length) {
            const customElements: CanvasElement[] = guestData.layoutElements.map((element) => {
              const el = element as CanvasElement;
              if (el.id === "g_name") return { ...el, content: String(customValues.g_name) };
              if (el.id === "g_table") return { ...el, content: String(customValues.g_table) };
              if (el.id === "rsvpQr") return { ...el, content: String(customValues.rsvpQr) };
              return { ...el, content: String(el.content) };
            });
            store.setElements(customElements);
          }
        }

        const serverStatus = guestData.attendanceStatus || (guestData.checkinStatus === "arrived" ? "Présent" : undefined);
        const storedStatus = typeof window !== "undefined" ? localStorage.getItem(`attendance-${guestId}`) : null;
        if (serverStatus || storedStatus) {
          setHasCheckedIn(true);
          setCheckInStatus(serverStatus ?? storedStatus ?? "");
        }
      } catch (err: unknown) {
        if ((err as DOMException)?.name === "AbortError") {
          return;
        }

        console.error("Error fetching guest:", err);
        setFetchError((err as Error)?.message || "Impossible de charger l'invitation.");
      } finally {
        clearTimeout(timeoutId);
        setIsPageLoading(false);
      }
    };

    setIsPageLoading(true);
    fetchGuest();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [guestId, retryCount]);

  const lang = (data?.lang || "fr") as Language;
  const t = translations[lang] || translations.fr;

  const getText = (value: unknown, fallback: string) => {
    return value && typeof value === "string" ? value : fallback;
  };

  const fullName = data
    ? data.fullName || (data.title ? `${data.title} ${data.name ?? ""}` : data.name ?? "")
    : getText(t.common?.guestDefault, "Cher invité");

  const table = data?.table ?? "?";
  const tableName = data?.tableName ?? getText(t.common?.unassigned, "Non assignée");
  const programmeTitle = getText(t.programme?.title, "Programme");
  const confirmationTitle = getText(t.attendance?.title, "Confirmation");
  const invitationTitle = getText(t.guestNav?.invitation, "Invitation");
  const hasProgramme = Boolean(
    (data?.eventSessions?.length || 0) + (data?.ceremonies?.length || 0) + (data?.configSessions?.length || 0),
  );
  const sections = useMemo(
    () => [
      { id: "invitation", label: invitationTitle, icon: <Heart className="w-4 h-4" /> },
      ...(hasProgramme
        ? [
            { id: "programme", label: programmeTitle, icon: <ListOrdered className="w-4 h-4" /> },
          ]
        : []),
      { id: "confirmation", label: confirmationTitle, icon: <UserCheck className="w-4 h-4" /> },
    ],
    [hasProgramme, invitationTitle, programmeTitle, confirmationTitle],
  );
  const visibleSectionCount = sections.length;
  const programmeSectionIndex = sections.findIndex((section) => section.id === "programme");
  const confirmationSectionIndex = sections.findIndex((section) => section.id === "confirmation");


  const handleSectionChange = (newIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(visibleSectionCount - 1, newIndex));
    if (boundedIndex === activeSection) return;
    setTransitionDirection(boundedIndex > activeSection ? "forward" : "backward");
    setActiveSection(boundedIndex);
    setVisitedSections((prev) => ({ ...prev, [boundedIndex]: true }));
  };

  const handleRetry = () => {
    setFetchError(null);
    setRetryCount((prev) => prev + 1);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX || null;
    touchStartY.current = event.touches[0]?.clientY || null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const endX = event.changedTouches[0]?.clientX || 0;
    const endY = event.changedTouches[0]?.clientY || 0;
    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > 40 && absX > absY) {
      if (deltaX < 0) {
        handleSectionChange(Math.min(activeSection + 1, visibleSectionCount - 1));
      } else {
        handleSectionChange(Math.max(activeSection - 1, 0));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const getSectionAnimation = (index: number) => {
    const direction = transitionDirection === "forward" ? 50 : -50;
    const hasVisited = visitedSections[index];
    return {
      initial: hasVisited ? { opacity: 1, x: 0 } : { opacity: 0, x: direction },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: direction * -1 },
    };
  };

  const handleAttendance = async (status: string) => {
    if (!guestId) return;
    try {
      const adminOrigin = getAdminOrigin();
      const response = await fetch(`${adminOrigin}/api/v1/checkins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, status }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Impossible de confirmer votre présence.");
      }

      setHasCheckedIn(true);
      setCheckInStatus(status);
      showToast(getText(t.toasts?.successAdd, "Confirmation enregistrée !"), "success");
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        (navigator as any).vibrate([30, 20, 30]);
      }
      localStorage.setItem(`attendance-${guestId}`, status);
      handleSectionChange(0);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error during check-in:", error);
      showToast(getText(t.toasts?.connError, "Échec de la confirmation. Réessayez."), "error");
    }
  };

  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: "50vw", y: "100vh", opacity: 1, scale: Math.random() * 0.5 + 0.5, rotate: 0 }}
          animate={{ x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh`, opacity: 0, rotate: 360 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={`absolute w-3 h-3 rounded-full ${i % 2 === 0 ? "bg-gold" : "bg-emerald"}`}
          style={{ left: `${Math.random() * 20 - 10}%`, top: `${Math.random() * 20 - 10}%` }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.12),transparent_25%),#fcfaf2] text-slate-900" ref={containerRef}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_25%)]" />
      <AnimatePresence>
        {hasCheckedIn && checkInStatus !== "Absent" && <Confetti />}
      </AnimatePresence>
      <FloatingDecorations type={lang === "fr" ? "traditional" : "civil"} />
      <LoadingScreen 
        isLoading={isPageLoading} 
        title={fullName} 
        images={[]}
        logoUrl={data?.logoUrl}
        eventType={data?.eventInfo?.eventType || "wedding"}
      />

      {/* Main content area */}
      <div className="w-full max-w-2xl mx-auto relative px-4 pb-24" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <AnimatePresence mode="wait">
          {fetchError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto mt-12 p-10 rounded-[2rem] shadow-2xl bg-white/95 border border-red-100 text-center backdrop-blur-sm"
            >
              <p className="text-sm font-semibold text-red-600 mb-4">Oups !</p>
              <p className="text-gray-600 mb-6">{fetchError}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center justify-center rounded-full bg-emerald px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald/20 hover:bg-emerald-dark transition"
              >
                Réessayer
              </button>
            </motion.div>
          ) : (
            <>
              {/* ===== SECTION 1: INVITATION ===== */}
              {activeSection === 0 && (
                <motion.div
                  key="invitation"
                  {...getSectionAnimation(0)}
                  transition={{ duration: 0.35 }}
                >
              <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gold-light/30 relative mx-4 mt-6">
                {/* Decorative background embellishments */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gold/5 rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald/5 rounded-full translate-x-20 translate-y-20 blur-3xl" />

                {/* Smart Canvas or Traditional Header */}
                {data?.smartDesign?.templateId ? (
                  <div className="p-6 bg-slate-950 border-b border-slate-900 flex flex-col items-center justify-center overflow-hidden relative">
                    <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald/20 border border-emerald/30 rounded-full text-emerald text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                      <Heart className="w-3 h-3 fill-emerald animate-pulse" /> INVITATION PERSONNALISÉE
                    </div>
                    <div className="w-[360px] h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-white relative">
                      <SmartCanvas />
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-dark p-8 md:p-10 text-center text-white relative">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={!isPageLoading ? { scale: 1 } : {}}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      className="flex justify-center mb-4"
                    >
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <Heart className="w-6 h-6 text-gold-light fill-gold-light" />
                      </div>
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={!isPageLoading ? { opacity: 0.7 } : {}}
                      transition={{ delay: 0.8 }}
                      className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase opacity-70 mb-2"
                    >
                      {(t as any).welcome}
                    </motion.p>
                    <motion.h1 
                      initial={{ opacity: 0, y: 10 }}
                      animate={!isPageLoading ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1 }}
                      className="text-3xl md:text-4xl font-bold text-gold-light tracking-tight mb-2"
                    >
                      {(t as any).title}
                    </motion.h1>
                    <div className="flex items-center justify-center gap-4 text-sm opacity-80 font-light">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {data?.eventInfo?.startDate 
                          ? new Date(data.eventInfo.startDate).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "2-digit", month: "long", year: "numeric" })
                          : (t as any).date
                        }
                      </span>
                      <span className="w-1 h-1 bg-white/30 rounded-full" />
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {data?.eventInfo?.location || data?.eventInfo?.city || (t as any).location}
                      </span>
                    </div>
                  </div>
                )}

                {/* Guest Info Section */}
                <div className="p-8 md:p-12 text-center relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={!isPageLoading ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.2 }}
                    className="mb-10"
                  >
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-3">
                      {(t as any).greeting}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 break-words leading-tight">
                      {fullName}
                    </h2>
                  </motion.div>

                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={!isPageLoading ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 1.5, type: "spring" }}
                    className="bg-gold-light/20 rounded-3xl p-6 md:p-8 border border-gold-light/40 relative group transition-all duration-500 hover:shadow-lg hover:shadow-gold/5"
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-gold-light text-gold text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {(t as any).placement}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="mb-2 p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        <UtensilsCrossed className="w-8 h-8 text-emerald" />
                      </div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{(t as any).tableNumLabel}</p>
                      <p className="text-2xl md:text-3xl font-black text-emerald tracking-tight drop-shadow-sm px-2 text-center">
                        {(!tableName || tableName === "Non assignée" || tableName === "Unassigned")
                          ? table
                          : (tableName.toLowerCase().startsWith("table") ? tableName : `Table ${tableName}`)
                        }
                      </p>
                    </div>

                    {hasCheckedIn && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 flex items-center justify-center gap-2 text-emerald font-bold bg-white/50 py-2 rounded-xl border border-emerald/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {checkInStatus}
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={!isPageLoading ? { opacity: 1 } : {}}
                    transition={{ delay: 2 }}
                    className="mt-12 text-sm text-gray-400 font-serif italic"
                  >
                    {(t as any).quote}
                  </motion.p>
                </div>

                <div className="px-6 pb-8 pt-4">
                  <button
                    type="button"
                    onClick={() => handleSectionChange(hasProgramme ? programmeSectionIndex : confirmationSectionIndex)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[2rem] bg-gradient-to-r from-emerald to-gold text-white px-6 py-4 text-sm font-bold shadow-2xl shadow-emerald/20 hover:from-emerald-dark hover:to-gold-dark transition"
                  >
                    {hasProgramme ? "Découvrir le programme" : "Confirmer ma présence"}
                  </button>
                </div>

                {/* Footer Accent */}
                <div className="h-2 bg-gradient-to-r from-gold via-gold-light to-gold" />
              </div>
            </motion.div>
          )}

          {/* ===== SECTION 2: PROGRAMME ===== */}
          {activeSection === 1 && (
            <motion.div
              key="programme"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
            >
              <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gold-light/30 relative mx-4 mt-6">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-emerald-950/80 to-slate-900 p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_60%)]" />
                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <ListOrdered className="w-7 h-7 text-emerald" />
                    </motion.div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
                      {(t as any).programme?.title || "Programme"}
                    </h2>
                    {data?.eventInfo?.title && (
                      <p className="text-xs text-white/50 font-medium">{data.eventInfo.title}</p>
                    )}
                  </div>
                </div>

                {/* Timeline content */}
                <div className="p-6">
                  <EventTimeline
                    sessions={data?.eventSessions || []}
                    ceremonies={data?.ceremonies || data?.configSessions || []}
                    eventDate={data?.eventInfo?.startDate}
                    lang={lang}
                    t={t}
                  />
                </div>

                <div className="px-6 pb-8 pt-4">
                  <button
                    type="button"
                    onClick={() => handleSectionChange(2)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[2rem] bg-gradient-to-r from-gold to-emerald text-white px-6 py-4 text-sm font-bold shadow-2xl shadow-gold/20 hover:from-gold-dark hover:to-emerald-dark transition"
                  >
                    Confirmer ma présence
                  </button>
                </div>

                {/* Footer */}
                <div className="h-2 bg-gradient-to-r from-emerald via-emerald-dark to-emerald" />
              </div>
            </motion.div>
          )}

          {/* ===== SECTION 3: CONFIRMATION ===== */}
          {activeSection === 2 && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
            >
              <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gold-light/30 relative mx-4 mt-6">
                <div className="p-8 bg-slate-50 rounded-b-[2.5rem]">
                  <AttendanceScreen
                    onSelect={handleAttendance}
                    guestName={fullName}
                    lang={lang as Language}
                    currentStatus={hasCheckedIn ? checkInStatus : null}
                    attendanceOptions={data?.attendanceOptions}
                  />
                </div>
                {/* Footer */}
                <div className="h-2 bg-gradient-to-r from-gold via-gold-light to-gold" />
              </div>
            </motion.div>
          )}
        </>
        )}
      </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      {!isPageLoading && (
        <GuestNavDots
          sections={sections}
          activeIndex={activeSection}
          onNavigate={handleSectionChange}
        />
      )}
    </div>
  );
}

export default function GuestPage() {
  return (
    <div className="bg-[#fcfaf2] min-h-full font-sans antialiased text-gray-900">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center p-4">
          <div className="w-12 h-12 border-4 border-gold-light border-t-gold rounded-full animate-spin" />
          <p className="text-gold font-medium animate-pulse">Chargement / Loading...</p>
        </div>
      }>
        <GuestContent />
      </Suspense>
    </div>
  );
}
