import { motion } from "framer-motion";
import { Users, Heart, Globe, Cake, Mic, Crown, Sparkles, Settings, LogOut } from "lucide-react";
import { Language, translations } from "@backend/translations";
import { EventConfig, EventType, formatEventDate } from "@backend/eventConfig";

interface HeaderProps {
  guestCount: number;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  eventConfig?: EventConfig | null;
}

const EVENT_TYPE_ICONS: Record<EventType, React.ComponentType<{ className?: string }>> = {
  wedding: Heart,
  birthday: Cake,
  conference: Mic,
  gala: Crown,
  other: Sparkles,
};

export function Header({ guestCount, lang, onLanguageChange, eventConfig }: HeaderProps) {
  const t = translations[lang];
  
  // Use event config for dynamic data, fallback to translations
  const eventName = eventConfig?.eventName || t.title;
  const eventDate = eventConfig?.eventDate ? formatEventDate(eventConfig.eventDate, lang) : t.date;
  const eventLocation = eventConfig?.eventLocation || t.location;
  const ceremony = eventConfig?.generatedTexts?.[lang]?.ceremony || t.ceremony;
  const EventIcon = eventConfig ? EVENT_TYPE_ICONS[eventConfig.eventType] : Heart;

  return (
    <div className="bg-emerald-dark bg-gradient-to-br from-emerald to-emerald-dark rounded-2xl p-6 mb-6 text-white shadow-xl relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform hover:scale-110 duration-1000" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {eventConfig?.logoUrl ? (
              <img src={eventConfig.logoUrl} alt="Logo" className="w-8 h-8 object-contain bg-white rounded-lg p-1 shadow-sm border border-white/20" />
            ) : (
              <EventIcon className="w-4 h-4 text-gold-light fill-gold-light" />
            )}
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase opacity-80">
              {ceremony}
            </span>
          </div>
          <motion.h1 
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="text-2xl sm:text-3xl font-bold text-gold-light tracking-tight bg-gradient-to-r from-gold-light via-white to-gold-light bg-[length:200%_auto] bg-clip-text text-transparent"
          >
            {eventName}
          </motion.h1>
          <p className="text-sm font-light opacity-90 mt-1">{eventDate} • {eventLocation}</p>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-3 mt-4">
            <Globe className="w-3.5 h-3.5 text-gold-light opacity-70" />
            <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-lg border border-white/10">
              <button
                onClick={() => onLanguageChange("fr")}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                  lang === "fr" ? "bg-gold text-white shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => onLanguageChange("en")}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                  lang === "en" ? "bg-gold text-white shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center border border-white/20 shadow-inner flex flex-col justify-center min-w-[100px]">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-gold-light" />
              <span className="text-2xl sm:text-3xl font-extrabold text-gold-light leading-none">
                {guestCount}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest mt-1 opacity-80">{t.guests}</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.href = "/setup"}
              className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center gap-3 transition-all border border-white/10"
              title={t.setup.projectSettings}
            >
              <Settings className="w-5 h-5 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">{t.setup.projectSettings}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
