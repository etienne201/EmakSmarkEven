import { DESIGN_DEFAULTS } from './designDefaults'

export interface ResolvedTokens {
  colorAccent:     string
  colorBackground: string
  colorButton:     string
  colorText:       string
  decorationStyle: string
  typography:      string
  logoUrl:         string
  backgroundUrl:   string
  welcomeText:     string
  quoteText:       string
  seatingLabel:    string
  hostInitials:    string
  glassmorphism:   boolean
  fontSizeBase:    number
  fontSizeTitle:   number
  borderRadius:    string
  spacing:         string
}

export function resolveDesignTokens(
  eventType: string,
  language:  'fr' | 'en',
  design:    Partial<any>,
  settings:  Partial<any>,
): ResolvedTokens {
  const def = DESIGN_DEFAULTS[eventType] ?? DESIGN_DEFAULTS.other

  // ── Palette ──────────────────────────────────────────────
  const palette = design.paletteType === 'custom' && design.colorAccent
    ? { accent: design.colorAccent, background: design.colorBackground,
        button: design.colorButton, text: design.colorText }
    : def.palette

  // ── Médias ───────────────────────────────────────────────
  const logoUrl       = design.logoUrl       || def.logoPlaceholder
  const backgroundUrl = design.backgroundUrl || def.backgroundPlaceholder

  // ── Textes ───────────────────────────────────────────────
  const welcomeText  = (language === 'fr' ? design.welcomeFr  : design.welcomeEn)
                       || def.welcome[language]
  const quoteText    = (language === 'fr' ? design.quoteFr    : design.quoteEn)
                       || def.quote[language]
  const seatingLabel = (language === 'fr' ? design.seatingLabelFr : design.seatingLabelEn)
                       || def.seatingLabel[language]

  return {
    colorAccent:     palette.accent,
    colorBackground: palette.background,
    colorButton:     palette.button,
    colorText:       palette.text,
    decorationStyle: design.decorationStyle || def.decorationStyle,
    typography:      design.typography      || def.typography,
    logoUrl,
    backgroundUrl,
    welcomeText,
    quoteText,
    seatingLabel,
    hostInitials:  settings.hostInitials || '',
    glassmorphism: design.glassmorphism  || false,
    fontSizeBase:  design.fontSizeBase   || 15,
    fontSizeTitle: design.fontSizeTitle  || 28,
    borderRadius:  design.borderRadius   || 'rounded',
    spacing:       design.spacing        || 'normal',
  }
}
