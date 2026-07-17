"use client";

import type { ReactNode } from "react";
import { SaveIndicator } from "./SaveIndicator";
import { StepperHeader } from "./StepperHeader";
import { STEPS } from "../steps.config";
import { useSetupStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumLogo } from "@frontend/components/PremiumLogo";

interface WizardShellProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  children: ReactNode;
}

export function WizardShell({
  currentStep,
  completedSteps,
  onStepClick,
  children,
}: WizardShellProps) {
  const meta = STEPS.find((s) => s.id === currentStep) ?? STEPS[0];
  const progress = Math.round((completedSteps.length / STEPS.length) * 100);
  const eventTitle = useSetupStore((s) => s.data.step1.title);

  return (
    <div className="es-app es-wizard relative overflow-hidden min-h-screen">
      
      {/* ================================================ BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[130px]" />
      </div>

      <div className="es-wizard-app-layout relative z-10 w-full flex justify-center items-center py-10 px-4 md:py-16">
        
        {/* ================================================ MAIN CONTENT */}
        <main className="es-wizard-main w-full max-w-[760px] bg-transparent">
          <div className="es-wizard-container w-full space-y-8">
            
            {/* ================================================ HEADER % */}
            <header className="flex flex-col gap-5 mb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {/* Brand Logo Accent */}
                  <PremiumLogo
                    src="/images/blanclogo.png"
                    size="sm"
                    variant="emerald"
                  />
                  
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      <span>Créer un événement</span>
                      {eventTitle && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="text-emerald-450">{eventTitle}</span>
                        </>
                      )}
                    </div>
                    <h1 className="text-xl font-black text-white">Assistant de Configuration</h1>
                  </div>
                </div>

                {/* SaveIndicator badge floating on top right */}
                <SaveIndicator />
              </div>

              {/* Progress and percentage */}
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-end text-xs font-semibold text-slate-400">
                  <span>Étape {currentStep} sur {STEPS.length} : {meta.title}</span>
                  <span className="text-emerald-400 font-extrabold text-sm tracking-tight">{progress}%</span>
                </div>
                
                <div className="es-wizard-progress" aria-hidden>
                  <motion.span 
                    className="es-wizard-progress-bar" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            </header>

            {/* ================================================ STEPPER 9 ÉTAPES */}
            <StepperHeader
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={onStepClick}
            />

            {/* Step Panel Container with premium page transitions */}
            <AnimatePresence mode="wait">
              <motion.section 
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="es-card es-card--pad es-wizard-panel w-full"
              >
                <div className="es-wizard-panel-head">
                  <h2>{meta.title}</h2>
                  <p className="es-subtle">{meta.subtitle}</p>
                </div>
                {children}
              </motion.section>
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}
