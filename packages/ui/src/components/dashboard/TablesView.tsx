"use client";

import { motion } from "framer-motion";
import { TableManager } from "@frontend/components/TableManager";
import { Language, translations } from "@backend/translations";

interface TablesViewProps {
  customTables: any[];
  updateTables: any;
  appLang: Language;
  onClose: () => void;
}

export function TablesView({ customTables, updateTables, appLang, onClose }: TablesViewProps) {
  const t = translations[appLang];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden min-h-[600px] p-10"
    >
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-gray-900">{t.tableManager.title}</h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Manage your guest seating plan</p>
        </div>
      </div>

      <TableManager 
        isOpen={true} 
        onClose={onClose} 
        tables={customTables} 
        onUpdateTables={updateTables} 
        lang={appLang} 
        inline={true}
      />
    </motion.div>
  );
}
