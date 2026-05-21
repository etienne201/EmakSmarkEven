"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  gradient?: boolean;
}

export function PremiumCard({ 
  children, 
  className = "", 
  title, 
  icon: Icon,
  gradient = false 
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`glass-panel p-6 ${gradient ? 'gradient-gold' : ''} ${className}`}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="p-2 bg-gold/10 rounded-lg">
              <Icon className="w-5 h-5 text-gold" />
            </div>
          )}
          {title && (
            <h3 className="text-lg font-bold text-premium text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Decorative subtle light effect */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gold/10 rounded-full blur-3xl" />
    </motion.div>
  );
}
