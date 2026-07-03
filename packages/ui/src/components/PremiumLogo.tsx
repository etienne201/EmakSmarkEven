"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export type PremiumLogoVariant = "gold" | "emerald" | "blue" | "glass";
export type PremiumLogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

interface PremiumLogoProps {
  src?: string | null;
  fallbackIcon?: LucideIcon | React.ComponentType<{ className?: string }>;
  initials?: string;
  variant?: PremiumLogoVariant;
  size?: PremiumLogoSize;
  className?: string;
}

const SIZE_CLASSES: Record<PremiumLogoSize, string> = {
  xs: "w-8 h-8 rounded-lg text-[10px]",
  sm: "w-10 h-10 rounded-xl text-xs",
  md: "w-12 h-12 rounded-2xl text-sm",
  lg: "w-14 h-14 rounded-2xl text-base",
  xl: "w-16 h-16 rounded-[1.25rem] text-lg",
  xxl: "w-20 h-20 rounded-[1.5rem] text-xl",
};

export function PremiumLogo({
  src,
  fallbackIcon: FallbackIcon,
  initials,
  variant = "emerald",
  size = "md",
  className = "",
}: PremiumLogoProps) {
  const sizeClass = SIZE_CLASSES[size];
  const [imageError, setImageError] = React.useState(false);

  // Determine if we should show the image or fall back
  const showImage = src && !imageError;

  return (
    <div className={`premium-logo-container variant-${variant} ${sizeClass} ${className}`}>
      {/* Glow aura behind the logo */}
      <div className="premium-logo-aura" />
      
      {/* Light shimmer sweep effect on hover */}
      <div className="premium-logo-shimmer" />
      
      {/* Premium glowing ring outer border */}
      <div className="premium-logo-glow-ring" />
      
      {/* Inner logo capsule */}
      <div className="premium-logo-inner">
        {showImage ? (
          <img
            src={src}
            alt="Logo"
            className="premium-logo-image"
            onError={() => setImageError(true)}
          />
        ) : FallbackIcon ? (
          <FallbackIcon className="premium-logo-icon" />
        ) : initials ? (
          <span className="premium-logo-initials text-white">{initials}</span>
        ) : (
          <span className="premium-logo-initials text-white">E</span>
        )}
      </div>
    </div>
  );
}
