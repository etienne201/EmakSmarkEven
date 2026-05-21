"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ChevronLeft, Check, Sparkles, Heart, Cake, 
  Mic, Crown, Calendar, MapPin, Clock, FileText, Palette, 
  ToggleLeft, Eye, EyeOff, X, Upload, ShieldCheck, 
  Layout, Type, Maximize, MousePointer2, CheckCircle2, 
  User, Mail, Phone, LogOut, Settings, Bell, Globe, Lock
} from "lucide-react";
import { useLocalStorage } from "@frontend/hooks/useLocalStorage";
import { useToast } from "@frontend/hooks/useToast";
import Cookies from "js-cookie";
import { Language, translations } from "@backend/translations";
import { apiRequest } from "@frontend/utils/api";
import {
  EventConfig, EventType, DecorationType, Ceremony,
  EVENT_TYPES, PRESET_PALETTES, DEFAULT_DECORATION,
  generateDefaultTexts, DEFAULT_EVENT_CONFIG, UISettings,
} from "@backend/eventConfig";
import { DashboardWrapper } from "@frontend/components/dashboard/DashboardWrapper";
import { useSmartDesignStore } from "@frontend/store/useSmartDesignStore";
import dynamic from "next/dynamic";

const SmartDesignEditor = dynamic(
  () => import("@frontend/components/design/SmartDesignEditor").then(m => m.SmartDesignEditor),
  { ssr: false }
);

const TABS = [
  { id: "general", label: "Général", icon: FileText },
  { id: "design", label: "Design & Style", icon: Palette },
  { id: "ui", label: "Interface (UI)", icon: Layout },
  { id: "profile", label: "Admin & Sécurité", icon: ShieldCheck }
];

export default function ConfigurationSuite() {
  const router = useRouter();
  const { showToast } = useToast();
  const [appLang] = useLocalStorage<Language>("mariage-app-lang", "fr");
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const t = translations[appLang];

  // Config State
  const [config, setConfig] = useState<EventConfig>(DEFAULT_EVENT_CONFIG);
  const [adminProfile, setAdminProfile] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [designEditorOpen, setDesignEditorOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("auth-token");
    if (!token) { router.push("/login"); return; }
    
    const payload = JSON.parse(atob(token.split(".")[1]));
    let currentOwnerId = payload.ownerId;
    
    // Support d'impersonation pour les super-admins
    if (payload.role === "super-admin" || payload.ownerId === "system") {
      try {
        const storedConfig = localStorage.getItem("event-config");
        if (storedConfig) {
          const parsed = JSON.parse(storedConfig);
          if (parsed?.ownerId) currentOwnerId = parsed.ownerId;
        }
      } catch (e) { /* ignore */ }
    }
    
    fetchData(currentOwnerId);
  }, []);

  const fetchData = async (oid: string) => {
    try {
      const [configRes, profileRes] = await Promise.all([
        apiRequest<EventConfig>(`/api/event-config?ownerId=${oid}`),
        apiRequest<any>(`/api/auth/admin/profile?ownerId=${oid}`)
      ]);

      if (configRes.data) {
        // Deep merge with defaults to prevent undefined properties
        const mergedConfig = {
          ...DEFAULT_EVENT_CONFIG,
          ...configRes.data,
          palette: { ...DEFAULT_EVENT_CONFIG.palette, ...(configRes.data.palette || {}) },
          uiSettings: { ...DEFAULT_EVENT_CONFIG.uiSettings, ...(configRes.data.uiSettings || {}) }
        };
        setConfig(mergedConfig);

        // Restore Smart Design Engine store state from db if present
        const dbSmartDesign = (configRes.data as any)?.smartDesign;
        const dbLayoutElements = (configRes.data as any)?.layoutElements;
        if (dbSmartDesign?.templateId) {
          const store = useSmartDesignStore.getState();
          store.setTemplate(dbSmartDesign.templateId);
          if (dbSmartDesign.dynamicValues) {
            Object.entries(dbSmartDesign.dynamicValues).forEach(([k, v]) => {
              store.updateDynamicValue(k, v as string);
            });
          }
          if (dbLayoutElements && dbLayoutElements.length > 0) {
            store.setElements(dbLayoutElements);
          }
        }
      }
      if (profileRes.data) {
        setAdminProfile({
          name: profileRes.data.name || "",
          email: profileRes.data.email || "",
          phone: profileRes.data.phone || "",
          password: ""
        });
      }
    } catch (e) {
      showToast("Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const storeState = useSmartDesignStore.getState();
      const updatedConfig: EventConfig = {
        ...config,
        smartDesign: {
          personality: storeState.designPersonality,
          templateId: storeState.currentTemplate?.id || "",
          dynamicValues: storeState.dynamicValues,
          autoAlignEnabled: storeState.smartModeActive,
          smartSpacingEnabled: storeState.smartModeActive,
          colorHarmonyMode: "adaptive" as const,
          typographyMode: "auto-scale" as const,
          designScores: storeState.designScore
        },
        layoutElements: storeState.elements
      };

      const { error } = await apiRequest("/api/event-config", {
        method: "POST",
        body: JSON.stringify(updatedConfig),
      });
      if (error) throw new Error(error);
      showToast("Configuration enregistrée !", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await apiRequest("/api/auth/admin/profile", {
        method: "PUT",
        body: JSON.stringify({ ...adminProfile, ownerId: config.ownerId }),
      });
      if (error) throw new Error(error);
      showToast("Profil admin mis à jour !", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <DashboardWrapper>
      <div className="min-h-[80vh] flex flex-col md:flex-row gap-8 py-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-2">
          <div className="px-4 mb-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Reglages</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Config Suite Pro</p>
          </div>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {(() => {
              const Icon = tab.icon as any;
              return <Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-emerald" : "opacity-40"}`} />;
            })()}
              {tab.label}
            </button>
          ))}
          <div className="pt-8 px-4">
            <button 
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-400 hover:border-slate-200 hover:text-slate-600 transition-all"
            >
              <X className="w-3 h-3" /> QUITTER
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 md:p-12 flex-1 overflow-y-auto max-h-[70vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* GENERAL TAB */}
                {activeTab === "general" && (
                  <>
                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center">
                          <FileText className="text-emerald w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900">Identité de l&apos;événement</h3>
                          <p className="text-xs text-slate-400 font-medium">Informations fondamentales diffusées sur vos supports.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom de l&apos;événement</label>
                          <input 
                            type="text" value={config.eventName || ""} 
                            onChange={(e) => setConfig({...config, eventName: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 focus:bg-white transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Type</label>
                          <select 
                            value={config.eventType}
                            onChange={(e) => setConfig({...config, eventType: e.target.value as any})}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 focus:bg-white transition-all font-bold"
                          >
                            {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.labelFr}</option>)}
                          </select>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6 pt-12 border-t border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                          <MapPin className="text-blue-500 w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900">Planification & Lieu</h3>
                          <p className="text-xs text-slate-400 font-medium">Quand et où se déroulera la magie.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Date</label>
                          <input type="date" value={config.eventDate || ""} onChange={(e) => setConfig({...config, eventDate: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 focus:bg-white transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Heure</label>
                          <input type="time" value={config.eventTime || ""} onChange={(e) => setConfig({...config, eventTime: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 focus:bg-white transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Ville</label>
                          <input type="text" value={config.eventLocation || ""} onChange={(e) => setConfig({...config, eventLocation: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 focus:bg-white transition-all font-bold" />
                        </div>
                      </div>
                    </section>

                    {/* Sessions & Program */}
                    <section className="space-y-6 pt-12 border-t border-slate-50">
                      <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                            <Clock className="text-purple-500 w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900">Programme & Phases</h3>
                            <p className="text-xs text-slate-400 font-medium">Découpez votre événement en moments clés.</p>
                          </div>
                        </div>
                        <button onClick={() => setConfig({...config, sessions: [...(config.sessions || []), { id: Date.now().toString(), name: "", startTime: "14:00", details: "", location: "", position: (config.sessions?.length || 0) }]})}
                          className="px-4 py-2 bg-emerald/10 text-emerald rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald/20 transition-all">
                          + Ajouter une phase
                        </button>
                      </div>
                      <div className="space-y-3">
                        {config.sessions?.map((s: any, i: number) => (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <input type="text" placeholder="Nom (ex: Cérémonie)" value={s.name} onChange={(e) => {
                              const next = [...(config.sessions || [])];
                              next[i].name = e.target.value;
                              setConfig({...config, sessions: next});
                            }} className="bg-white rounded-xl px-4 py-2 outline-none text-xs font-bold shadow-sm" />
                            <input type="time" value={s.startTime} onChange={(e) => {
                              const next = [...(config.sessions || [])];
                              next[i].startTime = e.target.value;
                              setConfig({...config, sessions: next});
                            }} className="bg-white rounded-xl px-4 py-2 outline-none text-xs font-bold shadow-sm" />
                            <input type="text" placeholder="Lieu" value={s.location} onChange={(e) => {
                              const next = [...(config.sessions || [])];
                              next[i].location = e.target.value;
                              setConfig({...config, sessions: next});
                            }} className="bg-white rounded-xl px-4 py-2 outline-none text-xs font-bold shadow-sm" />
                            <button onClick={() => {
                              const next = (config.sessions || []).filter((_: any, idx: number) => idx !== i);
                              setConfig({...config, sessions: next});
                            }} className="text-red-400 text-[10px] font-black uppercase hover:text-red-600">Supprimer</button>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Specific Fields */}
                    <section className="space-y-6 pt-12 border-t border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                          <Sparkles className="text-amber-500 w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900">Champs Spécifiques : {config.eventType}</h3>
                          <p className="text-xs text-slate-400 font-medium">Données personnalisées selon le type d&apos;événement.</p>
                        </div>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[2rem] grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config.eventType === "wedding" && (
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Titre de l&apos;union</label>
                            <input type="text" value={config.specificFields?.unionTitle || ""} onChange={(e) => setConfig({...config, specificFields: {...config.specificFields, unionTitle: e.target.value}})}
                              placeholder="Ex: Mariage de Julie & Marc" className="w-full bg-white border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 font-bold shadow-sm" />
                          </div>
                        )}
                        {config.eventType === "birthday" && (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Âge fêté</label>
                              <input type="number" value={config.specificFields?.birthdayAge || ""} onChange={(e) => setConfig({...config, specificFields: {...config.specificFields, birthdayAge: parseInt(e.target.value)}})}
                                className="w-full bg-white border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 font-bold shadow-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom</label>
                              <input type="text" value={config.specificFields?.birthdayPersonName || ""} onChange={(e) => setConfig({...config, specificFields: {...config.specificFields, birthdayPersonName: e.target.value}})}
                                className="w-full bg-white border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 font-bold shadow-sm" />
                            </div>
                          </>
                        )}
                        {config.eventType === "conference" && (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Organisateur</label>
                              <input type="text" value={config.specificFields?.organizer || ""} onChange={(e) => setConfig({...config, specificFields: {...(config.specificFields || {}), organizer: e.target.value}})}
                                className="w-full bg-white border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 font-bold shadow-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Lien Inscription</label>
                              <input type="url" value={config.specificFields?.registrationUrl || ""} onChange={(e) => setConfig({...config, specificFields: {...(config.specificFields || {}), registrationUrl: e.target.value}})}
                                className="w-full bg-white border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald/20 font-bold shadow-sm" />
                            </div>
                          </>
                        )}
                      </div>
                    </section>
                  </>
                )}

                {/* DESIGN TAB */}
                {activeTab === "design" && (
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <Palette className="text-amber-500 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Identité Visuelle</h3>
                        <p className="text-xs text-slate-400 font-medium">Personnalisez les couleurs et le logo de votre événement.</p>
                      </div>
                    </div>

                    {/* NEW: Smart Design Engine Premium Card */}
                    <div className="p-8 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 text-white rounded-[2.5rem] shadow-xl border border-emerald-900/20 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.15),transparent_40%)]" />
                      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald/10 border border-emerald/20 rounded-full text-emerald text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> Smart Design Engine Active
                          </div>
                          <h4 className="text-2xl font-black tracking-tight text-white">Éditeur d&apos;Invitation Intelligent ✨</h4>
                          <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
                            Personnalisez le design de votre invitation premium, ajustez les zones de texte dynamiques et visualisez le rendu final en temps réel.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDesignEditorOpen(true)}
                          className="px-8 py-4 bg-emerald text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald/20 hover:bg-emerald/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap self-stretch md:self-auto justify-center"
                        >
                          <Palette className="w-4 h-4" /> LANCER L&apos;ÉDITEUR SMART 🎨
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-8 bg-slate-50 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
                      <div className="w-32 h-32 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
                        {config.logoUrl ? <img src={config.logoUrl} className="w-full h-full object-contain" /> : <Upload className="w-8 h-8 text-slate-200" />}
                      </div>
                      <div className="flex-1 space-y-4">
                        <h4 className="font-bold text-slate-900 text-sm">Logo Officiel</h4>
                        <p className="text-xs text-slate-500">Utilisez un fichier PNG ou JPEG haute résolution (recommandé 400x400px).</p>
                        <label className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 cursor-pointer hover:bg-slate-100 transition-all">
                          <Upload className="w-4 h-4" /> CHANGER LE LOGO
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setConfig({...config, logoUrl: reader.result as string});
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-bold text-sm text-slate-900 px-4">Palette de Couleurs</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400">Accent Primaire</label>
                            <div className="flex items-center gap-3">
                              <input 
                                type="color" 
                                value={config.palette?.primary || "#313366"} 
                                onChange={(e) => setConfig({...config, palette: {...(config.palette || DEFAULT_EVENT_CONFIG.palette), primary: e.target.value}})} 
                                className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" 
                              />
                              <span className="text-xs font-mono font-bold uppercase">{config.palette?.primary}</span>
                            </div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400">Accent Secondaire</label>
                            <div className="flex items-center gap-3">
                              <input 
                                type="color" 
                                value={config.palette?.secondary || "#228b22"} 
                                onChange={(e) => setConfig({...config, palette: {...(config.palette || DEFAULT_EVENT_CONFIG.palette), secondary: e.target.value}})} 
                                className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" 
                              />
                              <span className="text-xs font-mono font-bold uppercase">{config.palette?.secondary}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-8 bg-slate-900 text-white rounded-[2rem] flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="text-emerald w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald">Preview Web</span>
                        </div>
                        <h5 className="text-xl font-black mb-4">{config.eventName}</h5>
                        <div className="flex gap-2">
                          <div className="w-full h-2 rounded-full" style={{ background: config.palette?.primary }} />
                          <div className="w-1/2 h-2 rounded-full" style={{ background: config.palette?.secondary }} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                      <div className="space-y-4">
                         <h4 className="font-bold text-sm text-slate-900">Contenu Localisé (FR)</h4>
                         <div className="space-y-4">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400">Message de Bienvenue</label>
                             <textarea value={config.welcomeFr || ""} onChange={(e) => setConfig({...config, welcomeFr: e.target.value})}
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs h-20 outline-none" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400">Citation / Slogan</label>
                             <input type="text" value={config.quoteFr || ""} onChange={(e) => setConfig({...config, quoteFr: e.target.value})}
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold outline-none" />
                           </div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <h4 className="font-bold text-sm text-slate-900">Labels & Boutons (FR)</h4>
                         <div className="space-y-4">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400">Label de placement</label>
                             <input type="text" value={config.seatingLabelFr || ""} onChange={(e) => setConfig({...config, seatingLabelFr: e.target.value})}
                               placeholder="Ex: Votre Table" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold outline-none" />
                           </div>
                           <div className="p-4 bg-emerald/5 border border-emerald/10 rounded-2xl">
                             <p className="text-[10px] text-emerald font-black uppercase tracking-widest">Conseil Pro</p>
                             <p className="text-[10px] text-emerald/60 mt-1">Ces textes seront affichés directement sur les scans de vos invités.</p>
                           </div>
                         </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* UI TAB */}
                {activeTab === "ui" && (
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Layout className="text-indigo-500 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Paramètres de l&apos;Interface</h3>
                        <p className="text-xs text-slate-400 font-medium">Contrôlez les fonctionnalités et le rendu de l&apos;application.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-900">Codes QR</p>
                            <p className="text-[10px] text-slate-400">Génération automatique des codes d&apos;invitation.</p>
                          </div>
                          <button 
                            onClick={() => setConfig({...config, qrEnabled: !config.qrEnabled})}
                            className={`w-12 h-6 rounded-full transition-all relative ${config.qrEnabled ? 'bg-emerald' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.qrEnabled ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-900">RSVP & Présences</p>
                            <p className="text-[10px] text-slate-400">Permettre la confirmation en ligne.</p>
                          </div>
                          <button 
                            onClick={() => setConfig({...config, rsvpEnabled: !config.rsvpEnabled})}
                            className={`w-12 h-6 rounded-full transition-all relative ${config.rsvpEnabled ? 'bg-emerald' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.rsvpEnabled ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-900">Noms sur Invitation</p>
                            <p className="text-[10px] text-slate-400">Afficher le nom de l&apos;invité sur la carte.</p>
                          </div>
                          <button 
                            onClick={() => setConfig({...config, showGuestNameOnCard: !config.showGuestNameOnCard})}
                            className={`w-12 h-6 rounded-full transition-all relative ${config.showGuestNameOnCard ? 'bg-emerald' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showGuestNameOnCard ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-900">Table sur Invitation</p>
                            <p className="text-[10px] text-slate-400">Afficher le numéro de table.</p>
                          </div>
                          <button 
                            onClick={() => setConfig({...config, showTableNumberOnCard: !config.showTableNumberOnCard})}
                            className={`w-12 h-6 rounded-full transition-all relative ${config.showTableNumberOnCard ? 'bg-emerald' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showTableNumberOnCard ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2rem] space-y-6">
                      <h4 className="font-bold text-sm text-slate-900">Design System & Typographie</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Police de Caractères</label>
                          <select value={config.typography} onChange={(e) => setConfig({...config, typography: e.target.value as any})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold shadow-sm">
                            <option value="sans">Modern Sans (Inter)</option>
                            <option value="serif">Classic Serif (Playfair)</option>
                            <option value="mono">Technical Mono (Fira)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Style des Bordures</label>
                          <select value={config.borderRadius} onChange={(e) => setConfig({...config, borderRadius: e.target.value as any})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold shadow-sm">
                            <option value="rounded">Arrondi</option>
                            <option value="pill">Pill</option>
                            <option value="soft">Doux</option>
                            <option value="sharp">Droit</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900">Effet Glassmorphism</p>
                          <p className="text-[10px] text-slate-400">Ajouter un flou d&apos;arrière-plan premium.</p>
                        </div>
                        <button 
                          onClick={() => setConfig({...config, glassmorphism: !config.glassmorphism})}
                          className={`w-12 h-6 rounded-full transition-all relative ${config.glassmorphism ? 'bg-emerald' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.glassmorphism ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="text-emerald w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Admin & Sécurité</h3>
                        <p className="text-xs text-slate-400 font-medium">Gérez vos accès personnels et la sécurité de l&apos;événement.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom de l&apos;Organisateur</label>
                          <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="text" value={adminProfile.name || ""} onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-emerald/20 focus:bg-white transition-all font-bold" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email de contact</label>
                          <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="email" value={adminProfile.email || ""} onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-emerald/20 focus:bg-white transition-all font-bold" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Téléphone</label>
                          <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="tel" value={adminProfile.phone || ""} onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})}
                              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-emerald/20 focus:bg-white transition-all font-bold" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nouveau Mot de Passe</label>
                          <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type={showPassword ? "text" : "password"} value={adminProfile.password} onChange={(e) => setAdminProfile({...adminProfile, password: e.target.value})}
                              placeholder="Laisser vide pour garder l'actuel"
                              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-emerald/20 focus:bg-white transition-all font-bold" />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                       <button 
                        onClick={handleSaveProfile} disabled={saving}
                        className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
                      >
                        {saving ? "SAUVEGARDE..." : "METTRE À JOUR LE PROFIL PRO"}
                      </button>
                    </div>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Persistent Footer */}
          {activeTab !== "profile" && (
            <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Bell className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pensez à sauvegarder vos modifications</span>
              </div>
              <button 
                onClick={handleSaveConfig} disabled={saving}
                className="px-10 py-4 bg-emerald text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald/20 hover:bg-emerald/90 transition-all active:scale-95"
              >
                {saving ? "SAUVEGARDE..." : "ENREGISTRER LES PARAMÈTRES"}
              </button>
            </div>
          )}
        </main>
      </div>
    {/* Smart Design Editor Overlay Modal */}
      <AnimatePresence>
        {designEditorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-slate-950/98 backdrop-blur-xl flex flex-col"
          >
            {/* Header Area */}
            <div className="px-8 py-4 border-b border-slate-900 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center">
                  <Palette className="text-emerald w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight">Smart Design Studio 🎨</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Éditeur d&apos;Invitation Premium</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    setSaving(true);
                    try {
                      const storeState = useSmartDesignStore.getState();
                      const updatedConfig: EventConfig = {
                        ...config,
                        smartDesign: {
                          personality: storeState.designPersonality,
                          templateId: storeState.currentTemplate?.id || "",
                          dynamicValues: storeState.dynamicValues,
                          autoAlignEnabled: storeState.smartModeActive,
                          smartSpacingEnabled: storeState.smartModeActive,
                          colorHarmonyMode: "adaptive" as const,
                          typographyMode: "auto-scale" as const,
                          designScores: storeState.designScore
                        },
                        layoutElements: storeState.elements
                      };
                      const { error } = await apiRequest("/api/event-config", {
                        method: "POST",
                        body: JSON.stringify(updatedConfig),
                      });
                      if (error) throw new Error(error);
                      setConfig(updatedConfig);
                      showToast("Design synchronisé et sauvegardé avec succès !", "success");
                    } catch (e: any) {
                      showToast(e.message || "Erreur lors de la sauvegarde", "error");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="px-5 py-2.5 bg-emerald/10 border border-emerald/20 text-emerald hover:bg-emerald/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  {saving ? "SAUVEGARDE..." : "SAUVEGARDER ✨"}
                </button>
                <button
                  type="button"
                  onClick={() => setDesignEditorOpen(false)}
                  className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-all active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Smart Design Editor Component */}
            <div className="flex-1 overflow-hidden relative bg-slate-950">
              <SmartDesignEditor />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardWrapper>
  );
}
