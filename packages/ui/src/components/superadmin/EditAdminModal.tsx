"use client";
import { useState, useEffect } from "react";
import { X, User, Mail, Lock, Shield, Loader2, Fingerprint, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@frontend/hooks/useToast";

interface EditAdminModalProps {
  isOpen: boolean;
  admin: any;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

export function EditAdminModal({ isOpen, admin, onClose, onSuccess, token }: EditAdminModalProps) {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
    status: "active",
    password: "" // Optional for password change
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        role: admin.role || "admin",
        status: admin.status || "active",
        password: ""
      });
    }
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/superadmin/admins/${admin.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showToast("Compte mis à jour avec succès", "success");
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        showToast(err.message || "Erreur lors de la mise à jour", "error");
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
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Édition Profil</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">ID: {admin?.id}</p>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nom Complet</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Adresse Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Accès</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button type="button" onClick={() => setFormData({...formData, role: "admin"})}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.role === "admin" ? "bg-[#3B3B6D]/20 border-[#3B3B6D] text-white" : "bg-white/5 border-white/5 text-slate-500"}`}>
                        Admin
                      </button>
                      <button type="button" onClick={() => setFormData({...formData, role: "super-admin"})}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.role === "super-admin" ? "bg-amber-400/20 border-amber-400 text-amber-400" : "bg-white/5 border-white/5 text-slate-500"}`}>
                        Super Admin
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Statut du Compte</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button type="button" onClick={() => setFormData({...formData, status: "active"})}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.status === "active" ? "bg-[#28A745]/20 border-[#28A745] text-[#28A745]" : "bg-white/5 border-white/5 text-slate-500"}`}>
                        Actif
                      </button>
                      <button type="button" onClick={() => setFormData({...formData, status: "blocked"})}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.status === "blocked" ? "bg-red-500/20 border-red-500 text-red-500" : "bg-white/5 border-white/5 text-slate-500"}`}>
                        Bloqué
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Changer le mot de passe (Optionnel)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input type="password" placeholder="Laisser vide pour ne pas changer" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <button disabled={isSaving} type="submit" className="w-full bg-white text-black hover:bg-slate-200 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                {isSaving ? "Mise à jour..." : "Enregistrer les modifications"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
