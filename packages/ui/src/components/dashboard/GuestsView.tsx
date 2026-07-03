"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, UserCheck, Filter, ChevronDown } from "lucide-react";
import { GuestCard } from "@frontend/components/GuestCard";
import { GuestForm } from "@frontend/components/GuestForm";
import { Language, translations } from "@backend/translations";
import { useAuth } from "@frontend/context/AuthContext";
import { hasWriteAccess } from "@frontend/utils/api-config";

interface GuestsViewProps {
  view: "list" | "form" | "qr";
  setView: (view: any) => void;
  search: string;
  setSearch: (s: string) => void;
  selectedTable: string;
  setSelectedTable: (t: string) => void;
  filteredGuests: any[];
  paginatedGuests: any[];
  customTables: any[];
  editId: string | number | null;
  setEditId: (id: string | number | null) => void;
  handleSaveGuest: any;
  _handleDeleteGuest: any;
  _setIsClearModalOpen: (b: boolean) => void;
  _setIsTableModalOpen: (b: boolean) => void;
  currentPage: number;
  setCurrentPage: (p: any) => void;
  totalPages: number;
  appLang: Language;
  origin: string;
  ownerId: string;
  eventConfig: any;
  setSelectedGuest: (g: any) => void;
  setDeleteGuestId: (id: any) => void;
  guests: any[];
}

export function GuestsView({
  view, setView, search, setSearch, selectedTable, setSelectedTable,
  filteredGuests, paginatedGuests, customTables, editId, setEditId,
  handleSaveGuest, _handleDeleteGuest, _setIsClearModalOpen, _setIsTableModalOpen,
  currentPage, setCurrentPage, totalPages, appLang, origin, ownerId, eventConfig,
  setSelectedGuest, setDeleteGuestId, guests
}: GuestsViewProps) {
  const t = translations[appLang];
  const { user } = useAuth();
  const canEdit = hasWriteAccess(user?.role);

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald transition-colors" style={{ color: 'var(--color-primary)' }} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2rem] outline-none focus:ring-4 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-sm font-medium text-gray-800 placeholder:text-gray-400"
            style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64 group">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <select 
              value={selectedTable} 
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2rem] outline-none focus:ring-4 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] appearance-none text-gray-700 font-bold text-sm"
              style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any}
            >
              <option value="all">{t.common.allTables}</option>
              {customTables.sort((a, b) => (a.number || 0) - (b.number || 0)).map((table) => (
                <option key={table.id} value={table.name}>{table.name.toLowerCase().startsWith("table") ? table.name : `Table ${table.name}`}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-emerald transition-colors" />
          </div>

          {canEdit && (
            <button 
              onClick={() => { setEditId(null); setView(view === "form" ? "list" : "form"); }}
              className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] font-bold text-sm transition-all duration-300 active:scale-95 ${
                view === "form" 
                  ? "bg-white/80 backdrop-blur-md border shadow-lg" 
                  : "text-white shadow-lg hover:scale-[1.02]"
              }`}
              style={{ 
                backgroundColor: view === "form" ? 'transparent' : 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                color: view === "form" ? 'var(--color-primary)' : 'white'
              }}
            >
              {view === "form" ? t.viewList : <><Plus className="w-5 h-5" /><span>{t.addGuest}</span></>}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px] relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-emerald/5 rounded-full blur-[100px] pointer-events-none opacity-50" />
        
        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.div key="list" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-8 relative z-10">
              {filteredGuests.length === 0 ? (
                <div className="text-center py-32 bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                  <div className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8 relative group" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}>
                    <div className="absolute inset-0 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all opacity-50" style={{ backgroundColor: 'var(--color-primary)' }} />
                    <UserCheck className="w-10 h-10 relative z-10 transform group-hover:scale-110 transition-transform duration-500" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
                    {search ? "Aucun résultat trouvé" : "Prêt à accueillir vos invités ?"}
                  </h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                    {search 
                      ? `Nous n'avons trouvé aucun invité correspondant à "${search}". Essayez de modifier vos filtres.` 
                      : "Commencez par ajouter vos premiers invités pour générer leurs invitations interactives et préparer le plan de table."}
                  </p>
                  {canEdit && !search && (
                    <button 
                      onClick={() => setView("form")}
                      className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-slate-800 transition-all duration-300"
                    >
                      <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform duration-300">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <span>Ajouter mon premier invité</span>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paginatedGuests.map((g) => (
                      <GuestCard 
                        key={g.id} 
                        guest={g} 
                        onOpenQR={(g) => { setSelectedGuest(g); setView("qr"); }} 
                        onEdit={(g) => { setEditId(g.id); setView("form"); }} 
                        onDelete={setDeleteGuestId} 
                        lang={appLang} 
                        origin={origin} 
                        ownerId={ownerId} 
                        showQR={eventConfig.enableQRCodes} 
                      />
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-8 bg-white rounded-[2rem] border border-gray-100">
                      <button 
                        onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))} 
                        disabled={currentPage === 1} 
                        className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {t.common.prev}
                      </button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                              currentPage === i + 1 ? "text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"
                            }`}
                            style={currentPage === i + 1 ? { backgroundColor: 'var(--color-primary)', boxShadow: '0 10px 15px -3px var(--color-primary)' } : undefined}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages} 
                        className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {t.common.next}
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {view === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                <GuestForm 
                  tables={customTables} 
                  guests={guests} 
                  initialData={editId ? guests.find(g => g.id === editId) : null} 
                  onSave={handleSaveGuest} 
                  onCancel={() => { setView("list"); setEditId(null); }} 
                  currentAppLang={appLang} 
                  maxGuestsPerTable={eventConfig.maxGuestsPerTable} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
