export interface TypographySuggestion {
  fontSize: string;
  letterSpacing: string;
  lineHeight: number;
}

/**
 * Smart Typography Engine
 * Adapts font size and tracking based on text length and personality.
 */
export function getSmartTypography(text: string, personality: string): TypographySuggestion {
  const charCount = text.length;
  
  let fontSize = '2rem';
  let letterSpacing = 'normal';
  let lineHeight = 1.2;

  // Base logic based on length to prevent overflows and keep elegance
  if (charCount < 15) {
    fontSize = '3.5rem';
    letterSpacing = '-0.02em';
    lineHeight = 1.1;
  } else if (charCount < 30) {
    fontSize = '2.5rem';
    letterSpacing = '-0.01em';
    lineHeight = 1.2;
  } else if (charCount < 60) {
    fontSize = '1.75rem';
    letterSpacing = 'normal';
    lineHeight = 1.3;
  } else {
    fontSize = '1.25rem';
    letterSpacing = '0.01em';
    lineHeight = 1.5;
  }

  // Adjustments based on Design Personality
  switch (personality) {
    case 'elegant-luxury':
      // Luxury prefers wider tracking and lighter heights
      letterSpacing = charCount < 20 ? '0.05em' : '0.02em';
      lineHeight += 0.1;
      break;
    case 'modern-minimal':
      letterSpacing = '-0.03em'; // Tighter
      break;
    case 'afro-celebration':
      fontSize = charCount < 20 ? '4rem' : fontSize; // Bolder, larger
      lineHeight = 1.0;
      break;
  }

  return { fontSize, letterSpacing, lineHeight };
}
