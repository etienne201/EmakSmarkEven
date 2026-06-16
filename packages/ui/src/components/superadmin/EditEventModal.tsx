"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { EventConfig, EventType } from "@backend/eventConfig";
import Cookies from "js-cookie";
import { fetchApi, parseApiJson } from "@frontend/utils/api";

const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: "wedding",    label: "Mariage",       icon: "💍" },
  { value: "birthday",   label: "Anniversaire",  icon: "🎂" },
  { value: "conference", label: "Conférence",    icon: "🎤" },
  { value: "gala",       label: "Gala / Soirée", icon: "👑" },
  { value: "other",      label: "Autre",         icon: "✨" },
];

interface EditEventModalProps {
  isOpen: boolean;
  event: EventConfig | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditEventModal({ isOpen, event, onClose, onSuccess }: EditEventModalProps) {
  const [form, setForm] = useState<Partial<EventConfig>>({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) setForm({ ...event });
  }, [event]);

  const handleSave = async () => {
    const eventId = (form as Record<string, unknown>).id ?? form.ownerId;
    if (!eventId) return;
    setLoading(true); setError("");
    const token = Cookies.get("auth-token");
    try {
      const res = await fetchApi(`/api/v1/events/${eventId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.eventName,
          eventType: form.eventType,
        }),
      });
      const { error } = await parseApiJson(res);
      if (res.ok && !error) { onSuccess(); onClose(); }
      else setError(error || "Erreur de mise à jour.");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && event && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">Modifier l&apos;Événement</h3>
                <p className="text-slate-500 font-mono text-xs mt-0.5">{event.ownerId}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

              {/* Event Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {EVENT_TYPES.map(t => (
                    <button key={t.value} onClick={() => setForm(f => ({ ...f, eventType: t.value }))}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${form.eventType === t.value ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-700 bg-slate-800/50 text-slate-500 hover:border-slate-600"}`}>
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-[9px] font-medium text-center leading-tight">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom</label>
                <input type="text" value={form.eventName || ""} onChange={e => setForm(f => ({ ...f, eventName: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all" />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                  <input type={showPass ? "text" : "password"} value={form.adminPassword || ""}
                    onChange={e => setForm(f => ({ ...f, adminPassword: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white font-mono outline-none focus:border-blue-500 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300">
                    {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div>
                  <p className="text-sm font-medium text-white">Statut du compte</p>
                  <p className="text-xs text-slate-500 mt-0.5">Suspendre bloque l&apos;accès au tableau de bord</p>
                </div>
                <button onClick={() => setForm(f => ({ ...f, isBlocked: !f.isBlocked }))}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${form.isBlocked ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"}`}>
                  {form.isBlocked ? "Suspendu" : "Actif"}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border border-slate-700 rounded-xl text-slate-400 hover:bg-slate-800 text-sm font-medium transition-all">
                Annuler
              </button>
              <button onClick={handleSave} disabled={loading}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? "Enregistrement..." : "Sauvegarder"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
