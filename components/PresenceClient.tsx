"use client";

import { PresenceList } from "@/components/PresenceList";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Language } from "@/lib/translations";
import { useRouter } from "next/navigation";

export function PresenceClient() {
  const router = useRouter();
  const [appLang] = useLocalStorage<Language>("mariage-app-lang", "fr");

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
