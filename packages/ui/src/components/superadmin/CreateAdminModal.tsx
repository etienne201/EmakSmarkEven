"use client";
import { useState } from "react";
import { X, User, Mail, Lock, Shield, Loader2, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@frontend/hooks/useToast";
import { fetchApi, parseApiJson } from "@frontend/utils/api";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

export function CreateAdminModal({ isOpen, onClose, onSuccess, token }: CreateAdminModalProps) {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "admin"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetchApi("/api/v1/super-admin/admins", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: formData.email,
          passwordHash: formData.password,
          fullName: formData.name,
          organizationName: formData.name,
          organizationSlug: formData.id || formData.email.split("@")[0],
        }),
      });

      const { data, error } = await parseApiJson<{
        emailSent?: boolean;
        emailSimulated?: boolean;
      }>(res);
      if (data && !error) {
        if (data.emailSimulated) {
          showToast("Compte créé. Email simulé — configurez SMTP dans .env", "info");
        } else if (data.emailSent === false) {
          showToast("Compte créé, mais l'email n'a pas pu être envoyé", "error");
        } else {
          showToast("Compte créé — email d'invitation envoyé", "success");
        }
        onSuccess();
        onClose();
        setFormData({ id: "", name: "", email: "", password: "", role: "admin" });
      } else {
        showToast(error || "Erreur lors de la création", "error");
      }
    } catch (err) {
      showToast("Erreur réseau", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B3B6D] to-transparent opacity-50" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Nouvel Administrateur</h2>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Identifiant Unique (ID)</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input required type="text" placeholder="MariageJean2024" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                      value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} />
                  </div>
                  <p className="mt-1.5 text-[9px] text-slate-600 font-medium italic">Cet ID sera utilisé comme préfixe pour ses URLs.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nom Complet</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input required type="text" placeholder="Jean Dupont" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input required type="email" placeholder="admin@emak.com" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input required type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                      value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 text-center">Niveau d&apos;accès système</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, role: "admin"})}
                      className={`p-4 rounded-2xl border transition-all text-left group ${
                        formData.role === "admin" 
                          ? "bg-[#3B3B6D]/10 border-[#3B3B6D] shadow-lg shadow-[#3B3B6D]/10" 
                          : "bg-white/5 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center transition-colors ${
                        formData.role === "admin" ? "bg-[#3B3B6D] text-white" : "bg-white/5 text-slate-500"
                      }`}>
                        <User className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">Admin</p>
                      <p className="text-[9px] text-slate-500 font-medium leading-tight mt-1">Gestion d&apos;événements individuels</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({...formData, role: "super-admin"})}
                      className={`p-4 rounded-2xl border transition-all text-left group ${
                        formData.role === "super-admin" 
                          ? "bg-amber-400/10 border-amber-400 shadow-lg shadow-amber-400/10" 
                          : "bg-white/5 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center transition-colors ${
                        formData.role === "super-admin" ? "bg-amber-400 text-black" : "bg-white/5 text-slate-500"
                      }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">Super Admin</p>
                      <p className="text-[9px] text-slate-500 font-medium leading-tight mt-1">Contrôle total du système & infrastructure</p>
                    </button>
                  </div>
                </div>
              </div>

              <button disabled={isSaving} type="submit" className="w-full bg-[#3B3B6D] hover:bg-[#2F2F5A] py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#3B3B6D]/20">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {isSaving ? "Création..." : "Initialiser le compte"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
