"use client";
import { useState, useRef } from "react";
import { User, Save, Loader2, Camera, Upload, ShieldCheck, CheckCircle2, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminProfileData {
  name: string;
  role?: string;
  avatarUrl?: string;
}

interface ProfileSettingsProps {
  profile: AdminProfileData;
  onSave: (data: { name: string; avatarUrl?: string }) => Promise<void>;
  onLogout: () => void;
}

export function ProfileSettings({ profile, onSave, onLogout }: ProfileSettingsProps) {
  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSave({ name, avatarUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const hasChanges = name !== profile.name || avatarUrl !== (profile.avatarUrl || "");

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2 border-l-4 border-[#28A745] pl-6"
      >
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Profil Système</h1>
        <p className="text-slate-500 font-medium">Configuration de l'identité Master EMAKO</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Avatar Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-4 flex flex-col items-center space-y-6"
        >
          <div className="relative group">
            <div className="w-64 h-64 bg-black border-2 border-[#3B3B6D] rounded-[40px] overflow-hidden flex items-center justify-center relative shadow-[0_0_50px_rgba(59,59,109,0.2)]">
              <AnimatePresence mode="wait">
                {avatarUrl ? (
                  <motion.img 
                    key="avatar"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    src={avatarUrl} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <img src="/images/bleulogo.png" alt="Logo" className="w-24 h-24 grayscale opacity-40" />
                    <span className="text-[10px] font-black text-[#3B3B6D] tracking-[0.3em] uppercase">No Identity</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Overlay */}
              <motion.div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="flex items-center gap-2 px-6 py-3 bg-[#28A745] text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  <Upload className="w-4 h-4" /> Charger
                </button>
                {avatarUrl && (
                  <button 
                    onClick={() => setAvatarUrl("")}
                    className="text-red-500 text-[10px] font-bold uppercase hover:underline"
                  >
                    Supprimer
                  </button>
                )}
              </motion.div>
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            
            {/* Corner Badge */}
            <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-[#3B3B6D] rounded-2xl flex items-center justify-center shadow-2xl border-4 border-black">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-white font-black text-xl uppercase tracking-tight">{name || "Super Admin"}</p>
            <p className="text-[#28A745] text-[10px] font-bold uppercase tracking-[0.2em]">Accès Niveau 0</p>
          </div>
        </motion.div>

        {/* Data Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 space-y-6"
        >
          <div className="bg-black border border-slate-800 rounded-[40px] p-10 space-y-8 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3B3B6D]/10 rounded-full blur-[80px]" />
            
            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#28A745] uppercase tracking-widest">Nom Public</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-6 py-5 text-sm text-white outline-none focus:border-[#3B3B6D] focus:ring-1 focus:ring-[#3B3B6D] transition-all"
                      placeholder="Identité Admin"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#28A745] uppercase tracking-widest">Type de Compte</label>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-5 flex items-center justify-between">
                    <span className="text-xs font-black text-white uppercase tracking-wider">Super Administrateur</span>
                    <ShieldCheck className="w-5 h-5 text-[#3B3B6D]" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#3B3B6D]/5 border border-[#3B3B6D]/20 rounded-3xl">
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  Note : En tant qu'administrateur système, votre profil est visible par tous les organisateurs d'événements lors des interactions de support. Veillez à maintenir une identité professionnelle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="relative flex-[2] group overflow-hidden bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
                >
                  <AnimatePresence mode="wait">
                    {saving ? (
                      <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Synchronisation...
                      </motion.div>
                    ) : saved ? (
                      <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-[#28A745]">
                        <CheckCircle2 className="w-4 h-4" /> Mis à jour avec succès
                      </motion.div>
                    ) : (
                      <motion.div key="normal" className="flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Enregistrer
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                <button
                  onClick={onLogout}
                  className="flex-1 flex items-center justify-center gap-2 py-5 border border-red-500/30 hover:bg-red-500/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#28A745] animate-pulse" />
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Système Opérationnel</span>
            </div>
            <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">EMAKO OS v4.0 — Security Layer</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
