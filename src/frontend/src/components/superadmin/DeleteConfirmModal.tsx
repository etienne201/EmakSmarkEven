"use client";
import { useState } from "react";
import { X, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmValue: string; // The ID to type to confirm
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, confirmValue }: DeleteConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (inputValue !== confirmValue) return;
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    setInputValue("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#0A0A0A] border border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-xl font-black text-white text-center uppercase tracking-tighter mb-2">Action Destructive</h2>
            <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
              Vous êtes sur le point de supprimer définitivement <span className="text-white font-bold">{title}</span>. 
              Cette action est irréversible.
            </p>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                Veuillez saisir <span className="text-red-500">{confirmValue}</span> pour confirmer
              </label>
              <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Saisissez l'ID ici..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-sm text-white outline-none focus:border-red-500 transition-all font-mono"
              />

              <div className="flex gap-3 pt-4">
                <button onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all">
                  Annuler
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={inputValue !== confirmValue || isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-red-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
