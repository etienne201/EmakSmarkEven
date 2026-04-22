"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Hash, Settings, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Language, translations } from "@/lib/translations";

export function AdminNavbar() {
  const pathname = usePathname();
  const [appLang] = useLocalStorage<Language>("mariage-app-lang", "fr");
  const t = translations[appLang];

  // Hide the admin navbar on the guest invitation page
  if (pathname === "/guest") return null;

  const navItems = [
    { href: "/", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/presence", label: t.nav.presence, icon: Users },
    { href: "/tables", label: t.nav.tables, icon: Hash },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gold-light/20 px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-gold/10 rounded-lg group-hover:bg-gold/20 transition-colors">
            <Heart className="w-5 h-5 text-gold fill-gold" />
          </div>
          <span className="font-serif font-bold text-gray-900 tracking-tight hidden sm:block">
            Danie & John
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "text-gold bg-gold/5" 
                    : "text-gray-500 hover:text-gold hover:bg-gold/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-gray-400"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-light/30 flex items-center justify-center text-gold text-xs font-bold border border-gold-light/20">
                DJ
            </div>
        </div>
      </div>
    </nav>
  );
}
