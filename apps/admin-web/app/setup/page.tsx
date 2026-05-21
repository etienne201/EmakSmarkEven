"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Heart, Cake, Mic, Crown, Calendar, MapPin, 
  Clock, FileText, Palette, User, ArrowRight, ArrowLeft,
  CheckCircle2, Upload, Settings, ShieldCheck, Mail, Phone, Lock,
  Eye, X, Download, Globe, Users
} from "lucide-react";
import Cookies from "js-cookie";
import { useToast } from "@frontend/hooks/useToast";
import { apiRequest } from "@frontend/utils/api";
import { 
  EventConfig, EventType, DecorationType, 
  EVENT_TYPES, PRESET_PALETTES, DEFAULT_DECORATION,
  generateDefaultTexts, DEFAULT_EVENT_CONFIG 
} from "@backend/eventConfig";
import { Language, translations } from "@backend/translations";
import { resolveDesignTokens } from "@frontend/lib/resolveDesignTokens";
import { InvitationPreview } from "@frontend/components/design/InvitationPreview";
import { SmartDesignEditor } from "@frontend/components/design/SmartDesignEditor";
import { useSmartDesignStore } from "@frontend/store/useSmartDesignStore";
import { TEMPLATE_PRESETS } from "@backend/presets/templates.preset";

const STEPS = [
  { id: "type", title: "Type d'événement", icon: Sparkles },
  { id: "details", title: "Informations & Programme", icon: FileText },
  { id: "visual", title: "Identité Visuelle", icon: Palette },
  { id: "settings", title: "Logique & Paramètres", icon: Settings },
  { id: "refinement", title: "Raffinement Expert", icon: ShieldCheck }
];

export default function SetupWizard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFinalPreview, setShowFinalPreview] = useState(false);
  const [appLang] = useState<Language>("fr");
  const t = translations[appLang];
  const [ownerId, setOwnerId] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Store Hooks declared at top level
  const selectedTemplateId = useSmartDesignStore(state => state.currentTemplate?.id);
  const currentTemplate = useSmartDesignStore(state => state.currentTemplate);
  const dynamicValues = useSmartDesignStore(state => state.dynamicValues);

  // --- Unified Form State ---
  const [formData, setFormData] = useState<any>({
    // Step 1 & 2
    eventType: "wedding",
    eventName: "",
    eventDate: "",
    eventTime: "14:00",
    eventLocation: "",
    eventCountry: "Cameroun",
    eventVenue: "",
    description: "",
    language: "fr",
    
    // Step 2: Sessions & Specific
    sessions: [],
    specificFields: {},

    // Step 3: Design & Media
    smartDesign: {
      personality: "elegant-luxury",
      autoAlignEnabled: true,
      smartSpacingEnabled: true,
      colorHarmonyMode: "adaptive",
      typographyMode: "auto-scale"
    },
    paletteType: "predefined",
    paletteId: "wedding",
    colorAccent: "#313366",
    colorBackground: "#ffffff",
    colorButton: "#313366",
    colorText: "#000000",
    decorationStyle: "floral",
    logoUrl: "",
    backgroundUrl: "",
    galleryImages: [], // For local preview
    galleryFileIds: [],

    // Step 4: Logic
    qrEnabled: true,
    qrType: "check_in",
    rsvpEnabled: true,
    seatingPlanEnabled: true,
    maxGuestsPerTable: 10,
    showGuestNameOnCard: true,
    showTableNumberOnCard: true,
    hostInitials: "",

    // Step 5: Design System
    typography: "sans",
    fontSizeBase: 15,
    fontSizeTitle: 28,
    spacing: "normal",
    borderRadius: "rounded",
    glassmorphism: false,
    welcomeFr: "",
    welcomeEn: "",
    quoteFr: "",
    quoteEn: "",
    seatingLabelFr: "Votre Table",
    seatingLabelEn: "Your Table",

    // Admin Profile
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: ""
  });

  useEffect(() => {
    const token = Cookies.get("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setOwnerId(payload.ownerId);
      setAdminName(payload.name || "");
      setAdminEmail(payload.email || "");
      
      setFormData((prev: any) => ({
        ...prev,
        adminName: payload.name || "",
        adminEmail: payload.email || ""
      }));
      
      // Check if already setup
      checkSetupStatus(payload.ownerId);
    } catch (e) {
      router.push("/login");
    }
  }, []);

  const checkSetupStatus = async (oid: string) => {
    try {
      const { data, status } = await apiRequest<any>(`/api/setup/status?ownerId=${oid}`);
      if (status === 401) {
        router.replace("/login");
        return;
      }
      if (data?.isConfigured) {
        router.replace("/home");
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  // Build a lean payload per step to avoid sending multi-MB base64 images
  const buildStepPayload = (stepNum: number) => {
    const isBase64 = (v: string) => v && v.startsWith("data:");
    switch (stepNum) {
      case 1:
        return {
          eventName: formData.eventName,
          title: formData.eventName,
          eventType: formData.eventType,
          language: formData.language,
          date: formData.eventDate,
          startTime: formData.eventTime,
          city: formData.eventLocation,
          country: formData.eventCountry,
          location: formData.eventVenue,
          description: formData.description,
        };
      case 2:
        return {
          sessions: formData.sessions,
          specificFields: formData.specificFields,
        };
      case 3:
        return {
          paletteType: formData.paletteType,
          paletteId: formData.paletteId,
          colorAccent: formData.colorAccent,
          colorBackground: formData.colorBackground,
          colorButton: formData.colorButton,
          colorText: formData.colorText,
          decorationStyle: formData.decorationStyle,
          // Only send URLs if they are actual remote URLs, not base64 data
          logoUrl: isBase64(formData.logoUrl) ? null : (formData.logoUrl || null),
          backgroundUrl: isBase64(formData.backgroundUrl) ? null : (formData.backgroundUrl || null),
          galleryFileIds: formData.galleryFileIds || [],
          smartDesign: formData.smartDesign,
        };
      case 4:
        return {
          qrEnabled: formData.qrEnabled,
          qrType: formData.qrType,
          rsvpEnabled: formData.rsvpEnabled,
          seatingPlanEnabled: formData.seatingPlanEnabled,
          maxGuestsPerTable: formData.maxGuestsPerTable,
          showGuestNameOnCard: formData.showGuestNameOnCard,
          showTableNumberOnCard: formData.showTableNumberOnCard,
          hostInitials: formData.hostInitials,
        };
      case 5:
        const storeState = useSmartDesignStore.getState();
        return {
          typography: formData.typography,
          fontSizeBase: formData.fontSizeBase,
          fontSizeTitle: formData.fontSizeTitle,
          spacing: formData.spacing,
          borderRadius: formData.borderRadius,
          glassmorphism: formData.glassmorphism,
          welcomeFr: formData.welcomeFr,
          welcomeEn: formData.welcomeEn,
          quoteFr: formData.quoteFr,
          quoteEn: formData.quoteEn,
          seatingLabelFr: formData.seatingLabelFr,
          seatingLabelEn: formData.seatingLabelEn,
          smartDesign: {
            personality: storeState.designPersonality,
            templateId: storeState.currentTemplate?.id,
            dynamicValues: storeState.dynamicValues,
            autoAlignEnabled: storeState.smartModeActive,
            smartSpacingEnabled: storeState.smartModeActive,
            colorHarmonyMode: "adaptive",
            typographyMode: "auto-scale"
          },
          layoutElements: storeState.elements
        };
      default:
        return formData;
    }
  };

  const handleNext = async () => {
    if (step === 5) {
      setShowFinalPreview(true);
      return;
    }

    setSaving(true);
    try {
      const payload = buildStepPayload(step);
      const { data, error } = await apiRequest(`/api/setup/step/${step}`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (error) throw new Error(error);
      
      const nextStep = step + 1;
      setStep(nextStep);

      // Pre-fill the template dynamic zones when moving to the refinement step (Step 5)
      if (nextStep === 5) {
        const store = useSmartDesignStore.getState();
        const template = store.currentTemplate;
        if (template) {
          let groom = "";
          let bride = "";
          const nameString = formData.eventName || "";
          const separators = [/ & /, / and /, / et /, / And /, / Et /];
          let matched = false;
          for (const sep of separators) {
            const parts = nameString.split(sep);
            if (parts.length >= 2) {
              groom = parts[0].trim();
              bride = parts[1].trim();
              matched = true;
              break;
            }
          }
          if (!matched) {
            groom = nameString.trim();
          }

          template.dynamicZones.forEach(zone => {
            let val = zone.defaultValue;
            if (zone.role === 'groom_name' && groom) {
              val = groom;
            } else if (zone.role === 'bride_name' && bride) {
              val = bride;
            } else if (zone.role === 'event_date' && formData.eventDate) {
              val = formData.eventDate;
            } else if (zone.role === 'quote') {
              val = formData.quoteFr || formData.quoteEn || zone.defaultValue;
            } else if (zone.role === 'dress_code' && formData.specificFields.dressCode) {
              val = formData.specificFields.dressCode;
            } else if (zone.role === 'hosts') {
              val = formData.eventName || zone.defaultValue;
            } else if (zone.role === 'contacts') {
              const phone = formData.adminPhone || "+237 600 00 00 00";
              const email = formData.adminEmail || "contact@emak.com";
              val = [phone, email];
            } else if (zone.role === 'qrcode') {
              val = `https://emak.event/invite/${ownerId || 'preview'}`;
            }
            store.updateDynamicValue(zone.id, val);
          });

          // Run auto-alignment spacing rules once to make sure layout is perfect
          store.analyzeCanvas();
          showToast("Données de l'événement synchronisées sur le flyer !", "success");
        }
      }
    } catch (err: any) {
      showToast(err.message || "Erreur de sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      // 1. Finalize Profile
      await apiRequest("/api/auth/admin/profile", {
        method: "PUT",
        body: JSON.stringify({
          ownerId,
          name: formData.adminName,
          email: formData.adminEmail,
          phone: formData.adminPhone,
          password: formData.adminPassword
        })
      });

      // 2. Finalize Setup
      const { error } = await apiRequest("/api/setup/finalize", { method: "POST" });
      if (error) throw new Error(error);

      showToast("Expérience configurée avec succès !", "success");
      router.push("/home?welcome=true");
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la finalisation", "error");
    } finally {
      setSaving(false);
    }
  };

  const tokens = resolveDesignTokens(
    formData.eventType,
    formData.language,
    formData,
    { hostInitials: formData.hostInitials }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin mb-6" />
        <h2 className="text-white font-bold animate-pulse">Initialisation de votre espace expert...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative font-sans">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      
      {/* Animated Glows */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald/20 blur-[120px] rounded-full" 
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" 
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">CREATE YOUR EVENT</h1>
              <p className="text-emerald/60 text-xs font-bold uppercase tracking-widest">Configuration Expert</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  step === i + 1 ? "bg-emerald border-emerald text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" : 
                  step > i + 1 ? "bg-emerald/20 border-emerald/40 text-emerald" : "bg-white/5 border-white/10 text-white/40"
                }`}>
                  {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-white/10 mx-1" />}
              </div>
            ))}
          </div>
        </header>

        {/* Main Wizard Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                {(() => {
                  const Icon = STEPS[step-1].icon as any;
                  return <Icon className="w-8 h-8 text-emerald" />;
                })()}
                <h2 className="text-3xl font-bold">{STEPS[step-1].title}</h2>
              </div>

              {/* STEP 1: TYPE */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {EVENT_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => { setFormData({...formData, eventType: type.value}); setStep(2); }}
                      className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all hover:scale-105 ${
                        formData.eventType === type.value ? "bg-emerald/10 border-emerald shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "bg-white/5 border-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                        formData.eventType === type.value ? "bg-emerald text-white" : "bg-white/10 text-white/40 group-hover:text-white"
                      }`}>
                        {type.value === "wedding" && <Heart className="w-8 h-8" />}
                        {type.value === "birthday" && <Cake className="w-8 h-8" />}
                        {type.value === "conference" && <Mic className="w-8 h-8" />}
                        {type.value === "gala" && <Crown className="w-8 h-8" />}
                        {type.value === "other" && <Sparkles className="w-8 h-8" />}
                      </div>
                      <span className="font-bold text-sm tracking-wide">{type.labelFr}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2: DETAILS & PROGRAMME */}
              {step === 2 && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Nom de l&apos;événement</label>
                      <input type="text" value={formData.eventName} onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                        placeholder="Ex: Mariage de Julie & Marc" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald/50 transition-all font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Langue</label>
                        <select value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald/50 transition-all font-bold">
                          <option value="fr">Français (FR)</option>
                          <option value="en">English (EN)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Date</label>
                        <input type="date" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald/50 transition-all font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Heure début</label>
                      <input type="time" value={formData.eventTime} onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald/50 transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Ville</label>
                      <input type="text" value={formData.eventLocation} onChange={(e) => setFormData({...formData, eventLocation: e.target.value})}
                        placeholder="Ex: Yaoundé" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald/50 transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Lieu / Salle</label>
                      <input type="text" value={formData.eventVenue} onChange={(e) => setFormData({...formData, eventVenue: e.target.value})}
                        placeholder="Ex: Hilton Yaoundé" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald/50 transition-all font-bold" />
                    </div>
                  </div>

                  {/* Sessions / Phases */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Programme & Phases</label>
                      <button onClick={() => setFormData({...formData, sessions: [...formData.sessions, { name: "", startTime: "14:00", venue: "", details: "" }]})}
                        className="text-[10px] font-black text-emerald hover:underline">+ AJOUTER UNE PHASE</button>
                    </div>
                    <div className="space-y-3">
                      {formData.sessions.map((s: any, i: number) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                          <input type="text" placeholder="Nom (ex: Cérémonie)" value={s.name} onChange={(e) => {
                            const newSessions = [...formData.sessions];
                            newSessions[i].name = e.target.value;
                            setFormData({...formData, sessions: newSessions});
                          }} className="bg-transparent border-b border-white/10 p-2 outline-none text-sm font-bold" />
                          <input type="time" value={s.startTime} onChange={(e) => {
                            const newSessions = [...formData.sessions];
                            newSessions[i].startTime = e.target.value;
                            setFormData({...formData, sessions: newSessions});
                          }} className="bg-transparent border-b border-white/10 p-2 outline-none text-sm font-bold" />
                          <input type="text" placeholder="Lieu" value={s.venue} onChange={(e) => {
                            const newSessions = [...formData.sessions];
                            newSessions[i].venue = e.target.value;
                            setFormData({...formData, sessions: newSessions});
                          }} className="bg-transparent border-b border-white/10 p-2 outline-none text-sm font-bold" />
                          <button onClick={() => {
                            const newSessions = formData.sessions.filter((_: any, idx: number) => idx !== i);
                            setFormData({...formData, sessions: newSessions});
                          }} className="text-red-400 text-[10px] font-black uppercase">Supprimer</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specific Fields per Type */}
                  <div className="p-6 bg-emerald/5 border border-emerald/20 rounded-3xl space-y-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald">Champs Experts : {formData.eventType}</h4>
                    </div>
                    {formData.eventType === "wedding" && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/40">Titre de l&apos;union</label>
                        <input type="text" placeholder="Ex: Union Sacrée" value={formData.specificFields.unionTitle || ""} 
                          onChange={(e) => setFormData({...formData, specificFields: {...formData.specificFields, unionTitle: e.target.value}})}
                          className="w-full bg-white/5 border-b border-white/10 p-4 outline-none font-bold" />
                      </div>
                    )}
                    {formData.eventType === "birthday" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/40">Âge fêté</label>
                          <input type="number" value={formData.specificFields.birthdayAge || ""} 
                            onChange={(e) => setFormData({...formData, specificFields: {...formData.specificFields, birthdayAge: parseInt(e.target.value)}})}
                            className="w-full bg-white/5 border-b border-white/10 p-4 outline-none font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/40">Nom de la personne</label>
                          <input type="text" value={formData.specificFields.birthdayPersonName || ""} 
                            onChange={(e) => setFormData({...formData, specificFields: {...formData.specificFields, birthdayPersonName: e.target.value}})}
                            className="w-full bg-white/5 border-b border-white/10 p-4 outline-none font-bold" />
                        </div>
                      </div>
                    )}
                    {formData.eventType === "conference" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/40">Organisateur</label>
                          <input type="text" value={formData.specificFields.organizer || ""} 
                            onChange={(e) => setFormData({...formData, specificFields: {...formData.specificFields, organizer: e.target.value}})}
                            className="w-full bg-white/5 border-b border-white/10 p-4 outline-none font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/40">Lien Inscription (Optionnel)</label>
                          <input type="url" value={formData.specificFields.registrationUrl || ""} 
                            onChange={(e) => setFormData({...formData, specificFields: {...formData.specificFields, registrationUrl: e.target.value}})}
                            className="w-full bg-white/5 border-b border-white/10 p-4 outline-none font-bold" />
                        </div>
                      </div>
                    )}
                    {formData.eventType === "gala" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/40">Thème du Gala</label>
                          <input type="text" value={formData.specificFields.galaTheme || ""} 
                            onChange={(e) => setFormData({...formData, specificFields: {...formData.specificFields, galaTheme: e.target.value}})}
                            className="w-full bg-white/5 border-b border-white/10 p-4 outline-none font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/40">Dress Code</label>
                          <input type="text" placeholder="Ex: Black Tie" value={formData.specificFields.dressCode || ""} 
                            onChange={(e) => setFormData({...formData, specificFields: {...formData.specificFields, dressCode: e.target.value}})}
                            className="w-full bg-white/5 border-b border-white/10 p-4 outline-none font-bold" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: VISUAL IDENTITY & MEDIA */}
              {step === 3 && (
                <div className="space-y-10">
                  {/* Smart Design Template Selector */}
                  <div className="p-8 bg-emerald/5 border border-emerald/20 rounded-[2.5rem]">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-6 h-6 text-emerald" />
                      <div>
                        <h3 className="text-lg font-black text-emerald uppercase tracking-wider">Template Personalization Engine</h3>
                        <p className="text-xs text-emerald/60 font-medium">Choisissez un design premium pour votre événement. Le système l'adaptera intelligemment à votre contenu.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {TEMPLATE_PRESETS.map(t => {
                        const isSelected = selectedTemplateId === t.id;
                        return (
                          <button key={t.id} onClick={() => {
                            useSmartDesignStore.getState().setTemplate(t.id);
                            setFormData({
                              ...formData,
                              templateId: t.id
                            });
                          }}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-4 text-left hover:scale-[1.01] ${isSelected ? 'border-emerald bg-emerald/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-black uppercase text-white">{t.name}</span>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{t.style} • {t.culture || "classic"}</p>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-emerald bg-emerald text-white' : 'border-white/20'}`}>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-dark" />}
                              </div>
                            </div>
                            <div className="h-32 bg-white/5 rounded-2xl flex items-center justify-center text-xs font-bold text-white/30 border border-white/5">
                              [ Visual Preview : {t.width} x {t.height} ]
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                        {formData.logoUrl ? (
                          <div className="relative">
                            <img src={formData.logoUrl} className="w-24 h-24 rounded-2xl object-cover shadow-2xl" />
                            <button onClick={() => setFormData({...formData, logoUrl: ""})} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full">&times;</button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-emerald mb-4" />
                            <h4 className="text-sm font-bold">Logo (PNG/SVG)</h4>
                            <label className="mt-4 px-6 py-2 bg-emerald/20 text-emerald rounded-xl text-xs font-black cursor-pointer">CHARGER
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setFormData({...formData, logoUrl: reader.result as string});
                                  reader.readAsDataURL(file);
                                }
                              }} />
                            </label>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                        {formData.backgroundUrl ? (
                          <div className="relative group">
                            <img src={formData.backgroundUrl} className="w-full h-32 rounded-2xl object-cover shadow-2xl transition-transform group-hover:scale-[1.02]" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                              <button onClick={() => setFormData({...formData, backgroundUrl: ""})} className="bg-red-500 p-2 rounded-full text-white"><Lock className="w-4 h-4 rotate-45" /></button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Calendar className="w-8 h-8 text-emerald mb-4" />
                            <h4 className="text-sm font-bold">Image de Fond</h4>
                            <label className="mt-4 px-6 py-2 bg-emerald/20 text-emerald rounded-xl text-xs font-black cursor-pointer hover:bg-emerald/30">CHARGER
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setFormData({...formData, backgroundUrl: reader.result as string});
                                  reader.readAsDataURL(file);
                                }
                              }} />
                            </label>
                          </>
                        )}
                      </div>

                      {/* Gallery Section */}
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                         <div className="flex items-center justify-between mb-4">
                           <label className="text-[10px] font-black uppercase text-white/40">Galerie Photos (Max 6)</label>
                           <span className="text-[10px] text-emerald font-black">{formData.galleryImages?.length || 0} / 6</span>
                         </div>
                         <div className="grid grid-cols-3 gap-2">
                           {formData.galleryImages?.map((img: string, idx: number) => (
                             <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                               <img src={img} className="w-full h-full object-cover" />
                               <button onClick={() => {
                                 const next = [...formData.galleryImages];
                                 next.splice(idx, 1);
                                 setFormData({...formData, galleryImages: next});
                               }} className="absolute top-1 right-1 bg-black/60 rounded-full p-1"><Lock className="w-3 h-3 text-white rotate-45" /></button>
                             </div>
                           ))}
                           {(!formData.galleryImages || formData.galleryImages.length < 6) && (
                             <label className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10">
                               <Upload className="w-4 h-4 text-white/20" />
                               <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => {
                                 const files = Array.from(e.target.files || []);
                                 const remaining = 6 - (formData.galleryImages?.length || 0);
                                 files.slice(0, remaining).forEach(file => {
                                   const reader = new FileReader();
                                   reader.onloadend = () => setFormData((prev: any) => ({...prev, galleryImages: [...(prev.galleryImages || []), reader.result]}));
                                   reader.readAsDataURL(file);
                                 });
                               }} />
                             </label>
                           )}
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <label className="text-[10px] font-black uppercase text-white/40 mb-4 block">Palette de Couleurs</label>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <button onClick={() => setFormData({...formData, paletteType: "predefined"})}
                            className={`p-4 rounded-2xl border-2 transition-all ${formData.paletteType === 'predefined' ? 'border-emerald bg-emerald/10' : 'border-transparent bg-white/5'}`}>
                            <span className="text-xs font-bold">PRÉDÉFINIE</span>
                          </button>
                          <button onClick={() => setFormData({...formData, paletteType: "custom"})}
                            className={`p-4 rounded-2xl border-2 transition-all ${formData.paletteType === 'custom' ? 'border-emerald bg-emerald/10' : 'border-transparent bg-white/5'}`}>
                            <span className="text-xs font-bold">PERSONNALISÉE</span>
                          </button>
                        </div>
                        {formData.paletteType === "custom" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] text-white/40">Accent</label>
                              <input type="color" value={formData.colorAccent} onChange={(e) => setFormData({...formData, colorAccent: e.target.value})} className="w-full h-10 rounded-lg bg-transparent border-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] text-white/40">Fond</label>
                              <input type="color" value={formData.colorBackground} onChange={(e) => setFormData({...formData, colorBackground: e.target.value})} className="w-full h-10 rounded-lg bg-transparent border-none" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <label className="text-[10px] font-black uppercase text-white/40 mb-4 block">Style de Décoration</label>
                        <select value={formData.decorationStyle} onChange={(e) => setFormData({...formData, decorationStyle: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-xs font-bold">
                          <option value="floral">Floral (Mariage/Anniv)</option>
                          <option value="sparkle">Sparkle (Gala)</option>
                          <option value="corporate">Corporate (Conférence)</option>
                          <option value="minimal">Minimaliste</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: LOGIC & SETTINGS + INVITATION PREVIEW */}
              {step === 4 && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold">Système QR Code</p>
                            <p className="text-[10px] text-white/40">Check-in automatique</p>
                          </div>
                          <button onClick={() => setFormData({...formData, qrEnabled: !formData.qrEnabled})}
                            className={`w-12 h-6 rounded-full relative transition-all ${formData.qrEnabled ? 'bg-emerald' : 'bg-white/10'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.qrEnabled ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold">RSVP & Présence</p>
                            <p className="text-[10px] text-white/40">Confirmation en ligne</p>
                          </div>
                          <button onClick={() => setFormData({...formData, rsvpEnabled: !formData.rsvpEnabled})}
                            className={`w-12 h-6 rounded-full relative transition-all ${formData.rsvpEnabled ? 'bg-emerald' : 'bg-white/10'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.rsvpEnabled ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold">Nom sur l&apos;invitation</p>
                            <p className="text-[10px] text-white/40">Afficher le nom de l&apos;invité</p>
                          </div>
                          <button onClick={() => setFormData({...formData, showGuestNameOnCard: !formData.showGuestNameOnCard})}
                            className={`w-12 h-6 rounded-full relative transition-all ${formData.showGuestNameOnCard ? 'bg-emerald' : 'bg-white/10'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.showGuestNameOnCard ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold">Table sur l&apos;invitation</p>
                            <p className="text-[10px] text-white/40">Afficher le placement</p>
                          </div>
                          <button onClick={() => setFormData({...formData, showTableNumberOnCard: !formData.showTableNumberOnCard})}
                            className={`w-12 h-6 rounded-full relative transition-all ${formData.showTableNumberOnCard ? 'bg-emerald' : 'bg-white/10'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.showTableNumberOnCard ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/40">Initiales & Branding</label>
                          <input type="text" maxLength={4} value={formData.hostInitials} onChange={(e) => setFormData({...formData, hostInitials: e.target.value.toUpperCase()})}
                            placeholder="Ex: J&M" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none font-bold" />
                        </div>
                      </div>
                    </div>

                    {/* Invitation Card Preview (Step 4c) */}
                    <div className="lg:col-span-3">
                      <div className="relative group perspective-1000">
                        <InvitationPreview 
                          tokens={tokens} 
                          guestName={formData.showGuestNameOnCard ? "Jean-Pierre Nkodo" : ""} 
                          eventTitle={formData.eventName} 
                        />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Aperçu Invitation</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-emerald/5 border border-emerald/20 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-emerald/60">Nom Admin</label>
                      <input type="text" value={formData.adminName} onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                        className="w-full bg-emerald/10 border-b border-emerald/20 p-3 outline-none font-bold text-emerald" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-emerald/60">Sécurité (Nouveau Mot de Passe)</label>
                      <input type="password" value={formData.adminPassword} onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                        placeholder="••••••••" className="w-full bg-emerald/10 border-b border-emerald/20 p-3 outline-none font-bold text-emerald" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PROFESSIONAL REFINEMENT + DESIGN PREVIEW */}
              {step === 5 && (
                <div className="space-y-10">
                  {/* Live Design Pre-filled Alert */}
                  <div className="p-6 bg-gradient-to-r from-emerald/20 to-blue-500/10 border border-emerald/30 rounded-[2rem] flex items-center gap-4 shadow-lg shadow-emerald/5">
                    <div className="w-10 h-10 bg-emerald/20 border border-emerald/30 rounded-full flex items-center justify-center text-emerald animate-pulse">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Aperçu Réel Pré-rempli ✨</h4>
                      <p className="text-xs text-white/60 mt-0.5">Votre flyer d&apos;invitation et son QR Code ont été automatiquement personnalisés avec vos noms, date, contacts et thèmes saisis lors des étapes précédentes. Ajustez le design en temps réel ci-dessous avant de valider votre déploiement final !</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {/* Smart Form Generator based on Template Dynamic Zones */}
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald">Champs Dynamiques du Template</h4>
                      
                      {(() => {
                        const updateDynamicValue = useSmartDesignStore.getState().updateDynamicValue;

                        if (!currentTemplate) {
                          return (
                            <p className="text-xs text-white/40 italic">Veuillez d'abord sélectionner un template de design à l'étape 3.</p>
                          );
                        }

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentTemplate.dynamicZones.map(zone => {
                              if (zone.type === 'qrcode') {
                                return (
                                  <div key={zone.id} className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-white/40">{zone.label} (Automatique)</label>
                                    <input type="text" value={dynamicValues[zone.id] || ""} disabled
                                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white/30 outline-none" />
                                  </div>
                                );
                              }

                              if (zone.type === 'list') {
                                return (
                                  <div key={zone.id} className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-white/40">{zone.label} (Séparés par des virgules)</label>
                                    <textarea 
                                      value={Array.isArray(dynamicValues[zone.id]) ? dynamicValues[zone.id].join(", ") : String(dynamicValues[zone.id] || "")}
                                      onChange={(e) => updateDynamicValue(zone.id, e.target.value.split(",").map(s => s.trim()))}
                                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-20 outline-none text-xs font-bold resize-none" />
                                  </div>
                                );
                              }

                              return (
                                <div key={zone.id} className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-white/40">{zone.label}</label>
                                  {zone.type === 'date' ? (
                                    <input type="date" value={dynamicValues[zone.id] || ""}
                                      onChange={(e) => updateDynamicValue(zone.id, e.target.value)}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none text-xs font-bold" />
                                  ) : (
                                    <input type="text" value={dynamicValues[zone.id] || ""}
                                      onChange={(e) => updateDynamicValue(zone.id, e.target.value)}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none text-xs font-bold" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Smart Design Engine (Step 5 Canvas) */}
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-emerald" />
                        <h3 className="text-lg font-black uppercase tracking-widest text-emerald">Smart Design Engine</h3>
                      </div>
                      <SmartDesignEditor />
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald to-emerald-dark rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.3)] border border-white/20">
                    <CheckCircle2 className="w-12 h-12 text-white mb-4" />
                    <h3 className="text-xl font-black mb-1">DÉPLOIEMENT FINAL</h3>
                    <p className="text-white/80 text-xs text-center max-w-md">Cliquez sur &quot;Finaliser l&apos;Expérience&quot; pour voir l&apos;aperçu complet de votre invitation avec toutes vos informations, puis confirmer le déploiement.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer Navigation */}
        <footer className="mt-12 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-sm tracking-widest text-white/40 hover:text-white transition-all disabled:opacity-0"
          >
            <ArrowLeft className="w-5 h-5" />
            RETOUR
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-white/20 font-black text-sm">0{step} / 05</span>
            <button
              onClick={handleNext}
              disabled={saving || (step === 2 && !formData.eventName)}
              className="flex items-center gap-4 px-10 py-5 bg-emerald text-white rounded-2xl font-black text-sm tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>SAUVEGARDE...</span>
                </>
              ) : (
                <>
                  <span>{step === 5 ? "FINALISER L'EXPÉRIENCE" : "SUIVANT"}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </footer>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FINAL PREVIEW & CONFIRMATION MODAL                    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showFinalPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-slate-950/98 backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-4 border-b border-white/5 bg-slate-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center">
                  <Eye className="text-emerald w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight">Aperçu Final de Votre Invitation ✨</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vérifiez toutes les informations avant le déploiement</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFinalPreview(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: two-column layout */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column: Event Summary */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Récapitulatif de Votre Événement
                  </h4>

                  {/* Event Core Info */}
                  <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald/10 rounded-full flex items-center justify-center">
                        {formData.eventType === 'wedding' && <Heart className="w-5 h-5 text-emerald" />}
                        {formData.eventType === 'birthday' && <Cake className="w-5 h-5 text-emerald" />}
                        {formData.eventType === 'conference' && <Mic className="w-5 h-5 text-emerald" />}
                        {formData.eventType === 'gala' && <Crown className="w-5 h-5 text-emerald" />}
                        {!['wedding','birthday','conference','gala'].includes(formData.eventType) && <Sparkles className="w-5 h-5 text-emerald" />}
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Type d&apos;événement</p>
                        <p className="text-white font-black text-lg">{EVENT_TYPES.find(e => e.value === formData.eventType)?.labelFr || formData.eventType}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Nom</p>
                        <p className="text-white font-bold text-sm">{formData.eventName || '—'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p>
                        <p className="text-white font-bold text-sm">{formData.eventDate || '—'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Heure</p>
                        <p className="text-white font-bold text-sm">{formData.eventTime || '—'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Lieu</p>
                        <p className="text-white font-bold text-sm">{formData.eventVenue || formData.eventLocation || '—'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> Pays</p>
                        <p className="text-white font-bold text-sm">{formData.eventCountry || '—'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> Langue</p>
                        <p className="text-white font-bold text-sm">{formData.language === 'fr' ? 'Français' : formData.language === 'en' ? 'English' : formData.language}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Values from Template */}
                  {currentTemplate && (
                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5" /> Contenus du Flyer — {currentTemplate.name}
                      </h5>
                      <div className="grid grid-cols-1 gap-3">
                        {currentTemplate.dynamicZones.map(zone => {
                          const val = dynamicValues[zone.id];
                          const displayVal = Array.isArray(val) ? val.join(', ') : String(val || '—');
                          return (
                            <div key={zone.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                              <span className="text-[10px] font-black text-emerald uppercase tracking-wider min-w-[100px] pt-0.5">{zone.label}</span>
                              <span className="text-sm text-white font-medium flex-1">{displayVal}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Admin & Settings Summary */}
                  <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5" /> Paramètres & Admin
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase">QR Code</p>
                        <p className="text-sm text-white font-bold">{formData.qrEnabled ? '✅ Activé' : '❌ Désactivé'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase">RSVP</p>
                        <p className="text-sm text-white font-bold">{formData.rsvpEnabled ? '✅ Activé' : '❌ Désactivé'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase">Plan de table</p>
                        <p className="text-sm text-white font-bold">{formData.seatingPlanEnabled ? '✅ Activé' : '❌ Désactivé'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase">Organisateur</p>
                        <p className="text-sm text-white font-bold">{formData.adminName || adminName || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Flyer Canvas */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Aperçu Visuel de Votre Flyer
                  </h4>
                  <div className="sticky top-4">
                    <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6">
                      <SmartDesignEditor />
                    </div>

                    {/* Export Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const stage = useSmartDesignStore.getState().stageRef;
                        if (stage) {
                          try {
                            const dataUrl = stage.toDataURL({ pixelRatio: 3 });
                            const link = document.createElement('a');
                            link.download = 'invitation-premium-hd.png';
                            link.href = dataUrl;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } catch {
                            showToast("Export en cours de préparation... Veuillez réessayer.", "error");
                          }
                        }
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest transition-all"
                    >
                      <Download className="w-4 h-4" /> Télécharger le Flyer en HD
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Confirm or Go Back */}
            <div className="px-8 py-5 border-t border-white/5 bg-slate-950 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setShowFinalPreview(false)}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                MODIFIER
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setShowFinalPreview(false);
                  handleFinish();
                }}
                className="flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-emerald to-emerald-dark text-white rounded-2xl font-black text-sm tracking-[0.2em] shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>DÉPLOIEMENT EN COURS...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>CONFIRMER & DÉPLOYER</span>
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
