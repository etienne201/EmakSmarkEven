import chroma from 'chroma-js';

export interface ColorSuggestion {
  background: string;
  primary: string;
  secondary: string;
  text: string;
  accent: string;
}

/**
 * Smart Color Harmony Engine
 * Generates premium color palettes based on a base color and personality.
 */
export function getSmartColorHarmony(baseColor: string, personality: string): ColorSuggestion {
  const base = chroma(baseColor);
  const luminance = base.luminance();
  
  // Decide if we need a dark or light theme based on base color luminance
  const isDarkBase = luminance < 0.3;

  let bg = isDarkBase ? base.darken(1.5).hex() : base.brighten(2).hex();
  let text = isDarkBase ? '#ffffff' : '#111827';
  let primary = base.hex();
  let secondary = base.set('hsl.h', '+30').hex(); // Analogous
  let accent = base.set('hsl.h', '+180').hex(); // Complementary

  switch (personality) {
    case 'elegant-luxury':
      // Muted, sophisticated tones
      bg = isDarkBase ? '#1a1a1a' : '#fcfaf2'; // Off-white or deep charcoal
      text = isDarkBase ? '#f5e6c8' : '#2c2c2c'; // Goldish text on dark, dark grey on light
      primary = chroma(baseColor).desaturate(1).hex();
      accent = '#d4af37'; // Always hint of gold
      break;

    case 'modern-minimal':
      bg = '#ffffff';
      text = '#000000';
      primary = base.hex();
      secondary = chroma(baseColor).alpha(0.1).hex(); // Subtle background shapes
      accent = base.hex(); // Monochromatic accent
      break;

    case 'night-party':
      bg = '#09090b'; // Near black
      text = '#ffffff';
      primary = chroma(baseColor).saturate(2).brighten(1).hex(); // Neon effect
      accent = chroma(primary).set('hsl.h', '+60').hex();
      break;
      
    case 'floral-romantic':
      bg = chroma(baseColor).brighten(2.5).desaturate(0.5).hex(); // Pastel
      text = chroma(baseColor).darken(2).hex();
      primary = chroma(baseColor).saturate(0.5).hex();
      accent = chroma(baseColor).set('hsl.h', '-30').hex(); // Rose/Peach tint
      break;
  }

  // Final accessibility check (WCAG AA minimum for text on background)
  if (chroma.contrast(text, bg) < 4.5) {
    text = chroma(bg).luminance() > 0.5 ? '#000000' : '#ffffff';
  }

  return {
    background: bg,
    primary,
    secondary,
    text,
    accent
  };
}
