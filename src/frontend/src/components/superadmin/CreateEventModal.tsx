"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { EventType } from "@backend/eventConfig";
import Cookies from "js-cookie";

const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: "wedding",    label: "Mariage",       icon: "💍" },
  { value: "birthday",   label: "Anniversaire",  icon: "🎂" },
  { value: "conference", label: "Conférence",    icon: "🎤" },
  { value: "gala",       label: "Gala / Soirée", icon: "👑" },
  { value: "other",      label: "Autre",         icon: "✨" },
];

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const [ownerId, setOwnerId]       = useState("");
  const [password, setPassword]     = useState("");
  const [eventName, setEventName]   = useState("");
  const [eventType, setEventType]   = useState<EventType>("wedding");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const reset = () => { setOwnerId(""); setPassword(""); setEventName(""); setEventType("wedding"); setError(""); };

  const handleClose = () => { reset(); onClose(); };

  const handleCreate = async () => {
    if (!ownerId.trim() || !password.trim()) { setError("L'ID et le mot de passe sont requis."); return; }
    setLoading(true); setError("");
    const token = Cookies.get("auth-token");
    try {
      const res = await fetch("/api/superadmin/events", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, adminPassword: password, eventName: eventName || "Nouvel Événement", eventType }),
      });
      const data = await res.json();
      if (res.ok) { reset(); onSuccess(); onClose(); }
      else setError(data.error || "Erreur lors de la création.");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">Créer un Événement</h3>
                <p className="text-slate-500 text-xs mt-0.5">Nouvel organisateur sur la plateforme</p>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

              {/* Event Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type d&apos;événement</label>
                <div className="grid grid-cols-5 gap-2">
                  {EVENT_TYPES.map(t => (
                    <button key={t.value} onClick={() => setEventType(t.value)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs transition-all ${eventType === t.value ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-700 bg-slate-800/50 text-slate-500 hover:border-slate-600"}`}>
                      <span className="text-xl">{t.icon}</span>
                      <span className="font-medium leading-tight text-center text-[9px]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom de l&apos;événement</label>
                <input type="text" value={eventName} onChange={e => setEventName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
                  placeholder="ex: Mariage de Sarah & Marc" />
              </div>

              {/* Owner ID */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID Organisateur <span className="text-red-400">*</span></label>
                <input type="text" value={ownerId} onChange={e => setOwnerId(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-blue-500 transition-all"
                  placeholder="ex: sarah-marc-2024" />
                <p className="text-[10px] text-slate-600">Identifiant unique, lettres minuscules et tirets uniquement.</p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mot de passe <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white font-mono outline-none focus:border-blue-500 transition-all"
                    placeholder="Mot de passe de l'organisateur" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300">
                    {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
              <button onClick={handleClose} className="flex-1 py-2.5 border border-slate-700 rounded-xl text-slate-400 hover:bg-slate-800 text-sm font-medium transition-all">
                Annuler
              </button>
              <button onClick={handleCreate} disabled={loading}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {loading ? "Création..." : "Créer"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
