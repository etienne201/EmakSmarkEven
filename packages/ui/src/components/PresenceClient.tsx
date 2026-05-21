"use client";
import { PresenceList } from "@frontend/components/PresenceList";
import { useLocalStorage } from "@frontend/hooks/useLocalStorage";
import { useAuthGuard } from "@frontend/hooks/useAuthGuard";
import { Language } from "@backend/translations";
import { useRouter } from "next/navigation";

export function PresenceClient() {
  const router = useRouter();
  const [appLang] = useLocalStorage<Language>("mariage-app-lang", "fr");
  const isReady = useAuthGuard();

  if (!isReady) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gold-light/20 overflow-hidden min-h-[600px] flex flex-col">
      <PresenceList 
        isOpen={true} 
        onClose={() => router.push("/")} 
        lang={appLang} 
      />
    </div>
  );
}
