import { QrCode, Edit2, Trash2, User, Link as LinkIcon, Copy } from "lucide-react";
import { translations } from "@backend/translations";
import { useToast } from "@frontend/hooks/useToast";
import { useAuth } from "@frontend/context/AuthContext";

interface Guest {
  id: number;
  title: string;
  name: string;
  table: number;
  tableName: string;
  lang: "fr" | "en";
}

interface GuestCardProps {
  guest: Guest;
  onOpenQR: (g: Guest) => void;
  onEdit: (g: Guest) => void;
  onDelete: (id: number) => void;
  lang: "fr" | "en";
  origin: string;
  ownerId?: string;
  showQR?: boolean;
}

export function GuestCard({ guest, onOpenQR, onEdit, onDelete, lang, origin, ownerId = "default", showQR = true }: GuestCardProps) {
  const t = translations[lang] || translations.fr;
  const { showToast } = useToast();
  const { user } = useAuth();
  const isStaff = user?.role === "staff";

  const initials = guest.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleCopyLink = () => {
    let guestOrigin = origin;
    if (guestOrigin.includes("localhost")) {
      const url = new URL(guestOrigin);
      url.port = "3000";
      guestOrigin = url.origin;
    }
    
    const link = `${guestOrigin}/guest?id=${guest.id}&ownerId=${encodeURIComponent(ownerId)}`;
    navigator.clipboard.writeText(link);
    showToast(t.linkCopied, "info");
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white hover:border-emerald/20 rounded-[1.5rem] p-5 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.06)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald/0 via-emerald/0 to-emerald/0 group-hover:from-emerald/[0.02] group-hover:to-transparent transition-all duration-500 pointer-events-none" />
      
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald/10 to-emerald/5 border border-emerald/10 flex items-center justify-center text-emerald font-black text-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10 shadow-inner">
        {initials || <User className="w-6 h-6" />}
      </div>

      <div className="ml-5 flex-1 min-w-0 relative z-10">
        <h3 className="font-bold text-slate-800 text-lg truncate tracking-tight mb-0.5">
          <span className="text-emerald font-semibold mr-1.5 opacity-80">{guest.title}</span> {guest.name}
        </h3>
        <div className="text-sm font-medium">
          {(!guest.tableName || guest.tableName.trim() === "Non assignée" || guest.tableName.trim() === "Unassigned")
            ? <span className="flex items-center gap-1.5 text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-slate-200" /> Non assigné</span>
            : <span className="flex items-center gap-1.5 text-emerald-dark truncate block max-w-[120px] sm:max-w-none bg-emerald/5 px-2.5 py-0.5 rounded-md w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
                {(() => {
                  const name = guest.tableName.trim();
                  const hasTablePrefix = name.toLowerCase().startsWith("table");
                  const display = hasTablePrefix ? name : `Table ${name}`;
                  return display;
                })()}
              </span>
          }
        </div>
      </div>

      <div className="flex flex-row gap-2 ml-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:opacity-100">
        {showQR && (
          <button
            onClick={handleCopyLink}
            className="p-2.5 bg-white text-slate-500 border border-slate-100 rounded-xl hover:bg-slate-50 hover:text-emerald transition-all active:scale-95 shadow-sm"
            title={t.copyLink}
            aria-label={`${t.copyLink} - ${guest.title} ${guest.name}`}
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
        {showQR && (
          <button
            onClick={() => onOpenQR(guest)}
            className="p-2.5 bg-emerald text-white rounded-xl hover:bg-emerald-dark hover:shadow-lg hover:shadow-emerald/20 transition-all active:scale-95 shadow-sm"
            title={t.print}
            aria-label={`${t.print} - ${guest.title} ${guest.name}`}
          >
            <QrCode className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onEdit(guest)}
          className="p-2.5 bg-white border border-slate-100 text-slate-500 rounded-xl hover:bg-emerald/5 hover:text-emerald hover:border-emerald/20 transition-all active:scale-95 shadow-sm"
          title={t.editGuest}
          aria-label={`${t.editGuest} - ${guest.title} ${guest.name}`}
        >
          <Edit2 className="w-4 h-4" />
        </button>
        {!isStaff && (
          <button
            onClick={() => onDelete(guest.id)}
            className="p-2.5 bg-white border border-slate-100 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 shadow-sm"
            title={t.deleteConfirm}
            aria-label={`${t.deleteConfirm} - ${guest.title} ${guest.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
