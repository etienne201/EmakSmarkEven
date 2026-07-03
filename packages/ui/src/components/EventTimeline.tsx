"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, Sparkles, CheckCircle2 } from "lucide-react";

interface Session {
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
}

interface EventTimelineProps {
  sessions: Session[];
  ceremonies?: Session[];
  eventDate?: string;
  lang?: string;
  t: any;
}

function getSessionStatus(startAt?: string, endAt?: string): "completed" | "ongoing" | "upcoming" {
  if (!startAt) return "upcoming";
  const now = new Date();
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : new Date(start.getTime() + 3600000);
  if (now > end) return "completed";
  if (now >= start && now <= end) return "ongoing";
  return "upcoming";
}

function formatTime(dateStr?: string, timeStr?: string): string {
  if (timeStr) return timeStr;
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function EventTimeline({ sessions, ceremonies = [], eventDate, lang = "fr", t }: EventTimelineProps) {
  // Merge sessions from DB and config
  const allSessions: Session[] = [
    ...ceremonies.map((c: any) => ({
      id: c.id || Math.random().toString(),
      name: c.name || c.type,
      title: c.name || c.type,
      startTime: c.time,
      location: c.location,
      details: c.details,
    })),
    ...sessions.map((s: any) => ({
      id: s.id,
      name: s.name || s.title,
      title: s.title || s.name,
      startTime: s.startTime,
      startAt: s.startAt,
      endAt: s.endAt,
      location: s.location || s.venue,
      details: s.details || s.description,
    })),
  ];

  if (allSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
          <Calendar className="w-10 h-10 text-gold/40" />
        </div>
        <p className="text-gray-400 text-sm font-medium">{t.programme?.noSessions || "Programme bientôt disponible"}</p>
      </div>
    );
  }

  return (
    <div className="relative px-2">
      {/* Timeline line */}
      <div className="absolute left-[29px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald/20 via-gold/20 to-emerald/10 rounded-full" />

      <div className="space-y-1">
        {allSessions.map((session, i) => {
          const status = getSessionStatus(session.startAt, session.endAt);
          const time = formatTime(session.startAt, session.startTime);
          const isOngoing = status === "ongoing";
          const isCompleted = status === "completed";

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative flex gap-4"
            >
              {/* Timeline node */}
              <div className="relative flex-shrink-0 flex flex-col items-center pt-1">
                <div className={`w-[18px] h-[18px] rounded-full border-[3px] z-10 transition-all duration-500 ${
                  isOngoing 
                    ? "bg-emerald border-emerald shadow-lg shadow-emerald/30 scale-125" 
                    : isCompleted 
                      ? "bg-gray-200 border-gray-300" 
                      : "bg-white border-gold/40"
                }`}>
                  {isOngoing && (
                    <span className="absolute inset-0 rounded-full bg-emerald/30 animate-ping" />
                  )}
                </div>
              </div>

              {/* Session card */}
              <div className={`flex-1 mb-4 rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${
                isOngoing 
                  ? "bg-emerald/5 border-emerald/20 shadow-lg shadow-emerald/5" 
                  : isCompleted 
                    ? "bg-gray-50 border-gray-100 opacity-60" 
                    : "bg-white border-gold-light/30 shadow-sm hover:shadow-md hover:border-gold/20"
              }`}>
                <div className="p-5">
                  {/* Status badge */}
                  {isOngoing && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald/10 rounded-full mb-3">
                      <span className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-emerald uppercase tracking-widest">
                        {t.programme?.ongoing || "En cours"}
                      </span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full mb-3">
                      <CheckCircle2 className="w-3 h-3 text-gray-400" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        {t.programme?.completed || "Terminé"}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h4 className={`text-base font-extrabold tracking-tight mb-2 ${
                    isOngoing ? "text-emerald-dark" : isCompleted ? "text-gray-400" : "text-gray-900"
                  }`}>
                    {session.title || session.name}
                  </h4>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {time && (
                      <span className={`flex items-center gap-1.5 font-bold ${
                        isOngoing ? "text-emerald" : "text-gold"
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {time}
                      </span>
                    )}
                    {session.location && (
                      <span className="flex items-center gap-1.5 text-gray-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {session.location}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  {session.details && (
                    <p className={`mt-3 text-xs leading-relaxed ${
                      isCompleted ? "text-gray-300" : "text-gray-500"
                    }`}>
                      {session.details}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
