"use client";
import { useState } from "react";
import { X, User, Mail, Shield, Loader2, AlertCircle, Building2, Copy, Check } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [accountType, setAccountType] = useState<"entreprise" | "personnel">("entreprise");
  const [targetRole, setTargetRole] = useState<"owner" | "super-admin">("owner");
  const [quotaError, setQuotaError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    roleOccupied: "",
    role: "admin"
  });

  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    passwordDefault: string;
    slug: string;
    orgName: string;
    accountType: string;
  } | null>(null);

  const resetForm = () => {
    setFormData({
      companyName: "",
      fullName: "",
      email: "",
      roleOccupied: "",
      role: "admin"
    });
    setTargetRole("owner");
    setStep("form");
    setCreatedCredentials(null);
    setCopied(false);
    setQuotaError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCopyCredentials = async () => {
    if (!createdCredentials) return;
    const isSuper = createdCredentials.accountType === "super-admin";
    const text = `Identifiants Administrateur EMAKO Smart Event :\n\n` +
                 `Type de compte : ${isSuper ? "Super Administrateur" : (createdCredentials.accountType === "entreprise" ? "Entreprise" : "Personnel")}\n` +
                 (isSuper ? "" : `Organisation : ${createdCredentials.orgName}\n`) +
                 `Identifiant (Email) : ${createdCredentials.email}\n` +
                 `Mot de passe par défaut : ${createdCredentials.passwordDefault}\n` +
                 (isSuper ? "" : `Identifiant de l'événement (Slug) : ${createdCredentials.slug}\n`);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast("Identifiants copiés dans le presse-papiers !", "success");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      showToast("Impossible de copier automatiquement", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        accountType: targetRole === "super-admin" ? "personnel" : accountType,
        companyName: (targetRole === "owner" && accountType === "entreprise") ? formData.companyName : undefined,
        fullName: (targetRole === "super-admin" || accountType === "personnel") ? formData.fullName : undefined,
        email: (targetRole === "super-admin" || accountType === "personnel") ? formData.email : undefined,
        roleOccupied: (targetRole === "owner" && accountType === "personnel") ? formData.roleOccupied : undefined,
        role: targetRole,
      };

      const res = await fetchApi("/api/v1/super-admin/admins", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const { data, error } = await parseApiJson<any>(res);
      if (data && !error) {
        setCreatedCredentials({
          email: data.generatedEmail || data.owner?.email || data.email || "",
          passwordDefault: data.generatedPassword || "",
          slug: data.slug || "",
          orgName: data.name || "",
          accountType: targetRole === "super-admin" ? "super-admin" : accountType,
        });

        if (data.emailSimulated) {
          showToast("Compte créé. Email simulé — configurez SMTP dans .env", "info");
        } else if (data.emailSent === false) {
          showToast("Compte créé, mais l'email n'a pas pu être envoyé", "error");
        } else {
          showToast("Compte créé — email d'invitation envoyé", "success");
        }
        
        onSuccess();
        setStep("success");
      } else {
        if (error && (error.toLowerCase().includes("quota") || error.toLowerCase().includes("limite"))) {
          setQuotaError(error);
        } else {
          showToast(error || "Erreur lors de la création", "error");
        }
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B3B6D] to-transparent opacity-50" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                {step === "form" ? "Nouvel Administrateur" : "Compte Initialisé"}
              </h2>
              <button onClick={handleClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector Rôle de l'administrateur */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Rôle de l&apos;Administrateur</label>
                  <div className="grid grid-cols-2 gap-3 bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setTargetRole("owner")}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        targetRole === "owner" 
                          ? "bg-[#3B3B6D] text-white shadow-md shadow-[#3B3B6D]/20" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      Organisateur (Owner)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetRole("super-admin")}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        targetRole === "super-admin" 
                          ? "bg-[#3B3B6D] text-white shadow-md shadow-[#3B3B6D]/20" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Super Admin
                    </button>
                  </div>
                </div>

                {/* Selector Type de compte */}
                {targetRole === "owner" && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Type de Structure</label>
                    <div className="grid grid-cols-2 gap-3 bg-white/5 p-1 rounded-2xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => setAccountType("entreprise")}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          accountType === "entreprise" 
                            ? "bg-[#3B3B6D] text-white shadow-md shadow-[#3B3B6D]/20" 
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        Entreprise
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType("personnel")}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          accountType === "personnel" 
                            ? "bg-[#3B3B6D] text-white shadow-md shadow-[#3B3B6D]/20" 
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        Personnel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {targetRole === "super-admin" ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="superadmin-fields" className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nom Complet</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                          <input required type="text" placeholder="Ex: Jean Dupont" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                            value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Adresse Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                          <input required type="email" placeholder="Ex: superadmin@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                      </div>
                    </motion.div>
                  ) : accountType === "entreprise" ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="entreprise-fields">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nom de l&apos;entreprise</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input required type="text" placeholder="Ex: EMAK Events Corp" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                          value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                      </div>
                      <p className="mt-2 text-[9px] text-slate-600 font-medium italic">
                        L&apos;identifiant de connexion, l&apos;URL unique de l&apos;événement et le mot de passe seront automatiquement générés et envoyés à cette structure.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="personnel-fields" className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nom Complet</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                          <input required type="text" placeholder="Ex: Jean Dupont" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                            value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Adresse Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                          <input required type="email" placeholder="Ex: jean.dupont@gmail.com" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rôle Occupé</label>
                        <div className="relative">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                          <input required type="text" placeholder="Ex: Organisateur Principal" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-[#3B3B6D] transition-all"
                            value={formData.roleOccupied} onChange={e => setFormData({...formData, roleOccupied: e.target.value})} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {quotaError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-xs font-medium space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Limite de quota atteinte</p>
                        <p className="text-[11px] opacity-80 mt-1">{quotaError}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => window.open("/billing", "_blank")}
                        className="px-3 py-1.5 bg-[#3B3B6D] hover:bg-[#2F2F5A] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        Mettre à niveau
                      </button>
                    </div>
                  </div>
                )}

                <button disabled={isSaving} type="submit" className="w-full bg-[#3B3B6D] hover:bg-[#2F2F5A] py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#3B3B6D]/20">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  {isSaving ? "Création..." : "Initialiser le compte"}
                </button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-emerald-400 text-xs font-medium flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Succès !</p>
                    <p className="text-[11px] opacity-80 mt-1">Le compte administrateur a été configuré. Un email d&apos;invitation contenant ces identifiants a été envoyé.</p>
                  </div>
                </div>

                <div className="space-y-4 bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#3B3B6D]/10 rounded-full blur-2xl" />
                  
                  <div className="space-y-3.5">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Type de compte</p>
                      <p className="text-sm font-bold text-white capitalize">{createdCredentials?.accountType === "super-admin" ? "Super Administrateur" : createdCredentials?.accountType}</p>
                    </div>

                    {createdCredentials?.orgName && (
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nom de la structure</p>
                        <p className="text-sm font-bold text-white">{createdCredentials?.orgName}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Identifiant (Email)</p>
                      <p className="text-sm font-bold text-white font-mono break-all">{createdCredentials?.email}</p>
                    </div>

                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mot de passe par défaut</p>
                      <p className="text-sm font-bold text-emerald-400 font-mono select-all bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/15 w-fit">{createdCredentials?.passwordDefault}</p>
                    </div>

                    {createdCredentials?.slug && (
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Slug d&apos;accès unique (URL)</p>
                        <p className="text-xs font-mono text-slate-400 break-all">/org/{createdCredentials?.slug}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={handleCopyCredentials} className="w-full bg-[#3B3B6D] hover:bg-[#2F2F5A] py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-white">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Identifiants copiés !" : "Copier les identifiants"}
                  </button>
                  
                  <button onClick={handleClose} className="w-full bg-white/5 hover:bg-white/10 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center text-slate-300 hover:text-white">
                    Terminer et fermer
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
