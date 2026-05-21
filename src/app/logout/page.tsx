"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      // 1. Optionnel: Appeler l'API de logout si elle existe
      try {
        await fetch("/api/auth/admin/logout", { method: "POST" });
      } catch (e) {
        // Ignorer si l'API échoue
      }

      // 2. Nettoyer les cookies et le stockage local
      Cookies.remove("auth-token");
      localStorage.removeItem("event-config");

      // 3. Rediriger après un court délai pour montrer l'animation
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] shadow-2xl max-w-md w-full"
      >
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <LogOut className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Déconnexion en cours</h1>
        <p className="text-slate-400 text-sm mb-8">Nous sécurisons votre session avant votre départ...</p>
        
        <div className="flex items-center justify-center gap-3 text-emerald-400 font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>À bientôt !</span>
        </div>
      </motion.div>
      
      <p className="mt-8 text-slate-600 text-xs uppercase tracking-[0.3em]">
        Smart Event AI OS — Premium Security
      </p>
    </div>
  );
}
