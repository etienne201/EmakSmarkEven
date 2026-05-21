"use client";

import { motion } from "framer-motion";
import { PresenceList } from "@frontend/components/PresenceList";
import { Language, translations } from "@backend/translations";

interface PresenceViewProps {
  appLang: Language;
  onClose: () => void;
}

export function PresenceView({ appLang, onClose }: PresenceViewProps) {
  const t = translations[appLang];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col min-h-[600px]"
    >
      <div className="p-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{t.presence.listTitle}</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Live Tracking Feed</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald uppercase tracking-widest">Active Connection</span>
        </div>
      </div>
      <div className="flex-1 p-2">
        <PresenceList 
          isOpen={true} 
          onClose={onClose} 
          lang={appLang} 
          inline={true}
        />
      </div>
    </motion.div>
  );
}
