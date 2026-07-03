"use client";
import { useState, useMemo } from "react";
import { User, Shield, Trash2, Edit2, Search, Lock, Power, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AdminsTableProps {
  admins: any[];
  onDelete: (id: string) => void;
  onEdit: (admin: any) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onResetPassword: (id: string) => void;
}

export function AdminsTable({ admins, onDelete, onEdit, onToggleStatus, onResetPassword }: AdminsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => 
      (admin.name || admin.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.id || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [admins, searchTerm]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-[2rem] border border-white/5">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, email ou ID..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs text-white outline-none focus:border-[#3B3B6D] transition-all"
          />
        </div>
        <div className="flex items-center gap-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <span>Total: <span className="text-white">{filteredAdmins.length}</span></span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Utilisateur</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Accès / Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dernière connexion</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedAdmins.map((admin, i) => (
                <motion.tr 
                  key={admin.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-[#3B3B6D]/20 border border-white/10 flex items-center justify-center text-[#3B3B6D] overflow-hidden">
                          {admin.photoURL ? (
                            <img src={admin.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black ${admin.status === 'active' ? 'bg-[#28A745]' : 'bg-red-500'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{admin.name || admin.fullName || "N/A"}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{admin.email}</p>
                        {admin.roleOccupied && (
                          <p className="text-[10px] text-indigo-400 font-semibold tracking-wide mt-0.5">{admin.roleOccupied}</p>
                        )}
                        {admin.organization?.name && (
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">Org : {admin.organization.name}</p>
                        )}
                        <p className="text-[9px] text-slate-600 font-mono mt-0.5">{admin.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {(() => {
                        const isSuper = admin.role === 'super-admin' || admin.role?.name === 'SUPER_ADMIN' || admin.role?.name === 'super-admin';
                        return (
                          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border w-fit ${
                            isSuper 
                              ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' 
                              : 'bg-[#3B3B6D]/10 border-[#3B3B6D]/20 text-[#3B3B6D]'
                          }`}>
                            <Shield className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                              {isSuper ? 'Master' : 'Admin'}
                            </span>
                          </div>
                        );
                      })()}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border w-fit ${
                        admin.status === 'active' 
                          ? 'bg-[#28A745]/10 border-[#28A745]/20 text-[#28A745]' 
                          : 'bg-red-500/10 border-red-500/20 text-red-500'
                      }`}>
                        {admin.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          {admin.status === 'active' ? 'Actif' : 'Bloqué'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">
                        {admin.lastLoginAt && !Number.isNaN(new Date(admin.lastLoginAt).getTime())
                          ? format(new Date(admin.lastLoginAt), "d MMM yyyy HH:mm", { locale: fr })
                          : "Jamais connecté"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => onResetPassword(admin.id)}
                        className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                        title="Réinitialiser le mot de passe"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onToggleStatus(admin.id, admin.status)}
                        className={`p-2.5 bg-white/5 rounded-xl transition-all ${
                          admin.status === 'active' 
                            ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' 
                            : 'text-slate-400 hover:text-[#28A745] hover:bg-[#28A745]/10'
                        }`}
                        title={admin.status === 'active' ? "Bloquer l'accès" : "Activer l'accès"}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEdit(admin)}
                        className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-[#3B3B6D] transition-all"
                        title="Modifier le profil"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(admin.id)}
                        className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {paginatedAdmins.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-700">
                        <Search className="w-8 h-8" />
                      </div>
                      <p className="text-slate-500 text-sm italic font-medium">
                        {searchTerm ? `Aucun résultat pour "${searchTerm}"` : "Aucun administrateur trouvé dans le système"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Page <span className="text-white">{currentPage}</span> sur {totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 disabled:opacity-30 transition-all text-slate-400"
              >
                Précédent
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-2.5 rounded-xl bg-[#3B3B6D] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2F2F5A] disabled:opacity-30 transition-all shadow-lg shadow-[#3B3B6D]/20"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
