"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Users,
  Mail,
  QrCode,
  BarChart3,
  PartyPopper,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Activity,
  Heart,
  Calendar,
  MapPin,
} from "lucide-react";
import { useAuthGuard } from "@frontend/hooks/useAuthGuard";
import { PremiumLogo } from "@frontend/components/PremiumLogo";

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Bienvenue sur EMAKO Smart Event",
    subtitle: "L'art de planifier, le plaisir de célébrer.",
    description:
      "Nous sommes ravis de vous accompagner dans la réussite de vos événements les plus précieux. Découvrez comment notre plateforme transforme l'organisation de vos célébrations.",
    icon: Sparkles,
    color: "from-amber-400 to-yellow-500",
    glowColor: "rgba(245, 158, 11, 0.15)",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 border border-dashed border-amber-500/20 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30"
        >
          <Sparkles className="w-16 h-16 text-amber-400" />
        </motion.div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Gestion Simplifiée des Invités",
    subtitle: "Importez, classez et placez vos invités.",
    description:
      "Importez vos listes d'invités depuis Excel, gérez leur présence (RSVP) et attribuez-les à des tables d'un simple clic grâce à notre gestionnaire de placement intuitif.",
    icon: Users,
    color: "from-blue-400 to-indigo-500",
    glowColor: "rgba(59, 130, 246, 0.15)",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="space-y-3 w-64 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-mono">INVITÉS IMPORTÉS</span>
            <span className="text-xs font-bold text-blue-400">120 / 120</span>
          </div>
          {[
            { name: "Famille Traoré", table: "Table D'Honneur", status: "Confirmé" },
            { name: "Marc & Sophie", table: "Table 4", status: "Confirmé" },
            { name: "Sarah Koné", table: "Table Awa", status: "Attente" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex justify-between items-center text-xs p-2 rounded bg-slate-950/50 border border-slate-800/50"
            >
              <div>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-[10px] text-slate-400">{item.table}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                item.status === "Confirmé" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Invitations Numériques Personnalisées",
    subtitle: "Vos invitations intelligentes et uniques.",
    description:
      "Créez et personnalisez des invitations élégantes adaptées à votre événement. Vos convives reçoivent leur lien d'invitation avec leur QR code d'accès unique.",
    icon: Mail,
    color: "from-rose-400 to-pink-500",
    glowColor: "rgba(244, 63, 94, 0.15)",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          initial={{ y: 20, rotate: -3, opacity: 0 }}
          animate={{ y: 0, rotate: -6, opacity: 0.9 }}
          className="absolute w-44 h-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 flex flex-col justify-between"
        >
          <div className="h-2 w-8 bg-slate-800 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <p className="font-serif italic text-xs text-center text-amber-200">Votre Événement</p>
          </div>
          <div className="w-16 h-16 bg-white p-1 rounded-lg self-center">
            <QrCode className="w-full h-full text-slate-950" />
          </div>
          <div className="h-2 w-12 bg-slate-800 rounded-full self-center" />
        </motion.div>

        <motion.div
          initial={{ y: 25, rotate: 3, opacity: 0 }}
          animate={{ y: -5, rotate: 6, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute w-44 h-64 bg-gradient-to-b from-[#0c2419] to-[#081a11] border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <div className="h-1.5 w-6 bg-white/20 rounded-full" />
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[8px] tracking-[0.2em] text-white/50 uppercase font-semibold">INVITATION</p>
            <p className="text-center text-[10px] text-amber-100 font-bold">M. & Mme. Traoré</p>
          </div>
          <div className="w-20 h-20 bg-white p-1 rounded-xl self-center flex items-center justify-center shadow-lg shadow-black/40">
            <QrCode className="w-16 h-16 text-slate-950" />
          </div>
          <div className="text-[8px] text-center text-emerald-400 font-bold bg-white/5 py-1.5 rounded-lg border border-white/5">
            TABLE 4 • PLACE ACCORDÉE
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Scan à l'Entrée & Accueil Premium",
    subtitle: "Un enregistrement instantané des arrivées.",
    description:
      "À leur arrivée, scannez les QR codes de vos invités avec notre application scanner intégrée. Validez leur présence instantanément et guidez-les vers leur table.",
    icon: QrCode,
    color: "from-emerald-400 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.15)",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Smartphone Scanner View */}
        <div className="w-52 h-72 bg-slate-950 border-4 border-slate-800 rounded-[2.5rem] p-3 relative flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-800 rounded-full" />
          <div className="h-6 flex items-center justify-between px-2 mt-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">SCANNER ACTIVE</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-28 h-28 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center p-2 relative">
              {/* Scan Laser effect */}
              <motion.div
                animate={{ y: [0, 96, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] z-10"
              />
              <QrCode className="w-20 h-20 text-emerald-500/30" />
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-2 bg-emerald-500/90 text-white font-bold text-[10px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-emerald-400"
            >
              <span>Accès Validé ✓</span>
            </motion.div>
          </div>

          <div className="h-8 border-t border-slate-900 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-[9px] text-slate-500 font-mono">
              [ ]
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Statistiques en Temps Réel",
    subtitle: "Visualisez l'état de votre événement en direct.",
    description:
      "Suivez vos statistiques en direct : pourcentage de présence globale, chronologie des arrivées à l'accueil, répartition des tables et régimes alimentaires.",
    icon: BarChart3,
    color: "from-cyan-400 to-blue-500",
    glowColor: "rgba(34, 211, 238, 0.15)",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="w-full bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Suivi en direct</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50 text-center">
              <span className="text-[10px] text-slate-400 uppercase">Présents</span>
              <p className="text-xl font-black text-cyan-400 mt-0.5">84 %</p>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50 text-center">
              <span className="text-[10px] text-slate-400 uppercase">Tables Pleines</span>
              <p className="text-xl font-black text-blue-400 mt-0.5">12 / 15</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>FLUX D&apos;ACCUEIL</span>
              <span>18:30 - 19:30</span>
            </div>
            <div className="h-16 flex items-end gap-1.5 px-2 bg-slate-950/40 rounded-lg border border-slate-800/30">
              {[20, 45, 90, 75, 30, 15, 60, 40].map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: idx * 0.1, duration: 1 }}
                  className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Prêt à créer votre événement ?",
    subtitle: "Commencez dès aujourd'hui en quelques étapes simples.",
    description:
      "La configuration initiale de votre événement ne prend que 3 minutes. Définissez son titre, sa date et son type pour déverrouiller l'accès complet à votre espace d'administration.",
    icon: PartyPopper,
    color: "from-emerald-400 to-emerald-600",
    glowColor: "rgba(16, 185, 129, 0.15)",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [-1, 1, -1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-xs text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl translate-x-8 -translate-y-8" />
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-6 h-6 text-emerald-400" />
          </div>
          <h4 className="text-white font-bold text-sm mb-1">Votre Espace est Prêt</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Nous avons créé votre espace. Étape suivante : créez votre premier événement pour concevoir les invitations.
          </p>
        </motion.div>
      </div>
    ),
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const isReady = useAuthGuard();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push("/setup?welcome=true");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const stepInfo = ONBOARDING_STEPS[currentStep];
  const StepIcon = stepInfo.icon;

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-400 font-medium animate-pulse">Chargement de votre espace...</p>
      </div>
    );
  }

  // Slide Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative flex flex-col justify-between font-sans">
      {/* Background Aurora Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[180px] opacity-20 transition-all duration-700"
          style={{ backgroundColor: stepInfo.glowColor }}
        />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PremiumLogo
            src="/images/blanclogo.png"
            size="sm"
            variant="emerald"
          />
          <span className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
            EMAKO Smart Event
          </span>
        </div>
        <button
          onClick={() => router.push("/setup?welcome=true")}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1.5 px-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5"
        >
          Passer
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-6 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center py-8">
          
          {/* Left Side: Information */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <motion.div
                key={currentStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${stepInfo.color} flex items-center justify-center shadow-lg shadow-black/40`}
              >
                <StepIcon className="w-6 h-6 text-white" />
              </motion.div>

              <div className="overflow-hidden relative min-h-[220px]">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4 absolute inset-x-0"
                  >
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                      {stepInfo.title}
                    </h1>
                    <h3 className="text-md font-semibold text-emerald-400">
                      {stepInfo.subtitle}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                      {stepInfo.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Stepper Dots Indicator & Controls */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                {ONBOARDING_STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentStep ? 1 : -1);
                      setCurrentStep(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep ? "w-6 bg-emerald-500" : "w-2 bg-slate-800 hover:bg-slate-700"
                    }`}
                    aria-label={`Aller à la diapositive ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: High-End Live Visual Simulation */}
          <div className="relative w-full h-[360px] md:h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/20 border border-white/5 rounded-[3rem] backdrop-blur-md shadow-3xl overflow-hidden flex items-center justify-center">
              {/* Inner Decorative Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {stepInfo.visual}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Footer Controls */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex justify-between items-center bg-slate-950/80 backdrop-blur-md">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 text-xs font-bold py-3 px-5 rounded-full border transition-all duration-300 ${
            currentStep === 0
              ? "opacity-30 border-slate-800 text-slate-600 cursor-not-allowed"
              : "border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Précédent</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="flex items-center gap-2 text-xs font-bold text-slate-950 py-3 px-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-350 hover:to-emerald-250 shadow-lg shadow-emerald-500/10 cursor-pointer transition-all duration-300"
        >
          <span>{currentStep === ONBOARDING_STEPS.length - 1 ? "Commencer" : "Suivant"}</span>
          {currentStep === ONBOARDING_STEPS.length - 1 ? (
            <PartyPopper className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </motion.button>
      </footer>
    </div>
  );
}
