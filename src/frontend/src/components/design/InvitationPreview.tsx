'use client'
import { ResolvedTokens } from '@frontend/lib/resolveDesignTokens'

interface Props {
  tokens:     ResolvedTokens
  guestName:  string
  eventTitle: string
}

const BORDER_RADIUS_MAP: Record<string, string> = {
  sharp: '0px', soft: '8px', rounded: '16px', pill: '24px',
}
const SPACING_MAP: Record<string, string> = {
  compact: '16px', normal: '24px', spacious: '36px',
}

export function InvitationPreview({ tokens, guestName, eventTitle }: Props) {
  const br = BORDER_RADIUS_MAP[tokens.borderRadius] ?? '16px'
  const sp = SPACING_MAP[tokens.spacing] ?? '24px'

  const card: React.CSSProperties = {
    background:   tokens.backgroundUrl
      ? `url(${tokens.backgroundUrl}) center/cover no-repeat`
      : tokens.colorBackground,
    color:        tokens.colorText,
    borderRadius: br,
    padding:      sp,
    fontFamily:   tokens.typography === 'serif'
      ? 'Georgia, "Times New Roman", serif'
      : tokens.typography === 'mono'
        ? '"Courier New", monospace'
        : 'var(--font-sans)',
    fontSize:     `${tokens.fontSizeBase}px`,
    width:        '100%',
    aspectRatio:  '1.6/1',
    overflow:     'hidden',
    position:     'relative',
    border:       `0.5px solid ${tokens.colorAccent}44`,
    boxShadow:    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  }

  const overlay: React.CSSProperties = tokens.backgroundUrl ? {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.35)',
    borderRadius: br,
  } : {}

  const content: React.CSSProperties = {
    position: 'relative', zIndex: 1,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, textAlign: 'center',
  }

  const titleStyle: React.CSSProperties = {
    fontSize:   `${tokens.fontSizeTitle}px`,
    fontWeight: 500,
    color: tokens.backgroundUrl ? '#ffffff' : tokens.colorText,
    lineHeight: 1.2,
  }

  const accentStyle: React.CSSProperties = {
    color: tokens.colorAccent, fontWeight: 500,
  }

  const welcomeStyle: React.CSSProperties = {
    fontSize: `${tokens.fontSizeBase - 1}px`,
    opacity: 0.85,
    color: tokens.backgroundUrl ? '#ffffff' : tokens.colorText,
    maxWidth: 280, lineHeight: 1.5,
  }

  const tableBox: React.CSSProperties = {
    background: tokens.glassmorphism
      ? 'rgba(255,255,255,0.15)'
      : `${tokens.colorAccent}18`,
    backdropFilter: tokens.glassmorphism ? 'blur(8px)' : undefined,
    border: `0.5px solid ${tokens.colorAccent}66`,
    borderRadius: br,
    padding: '8px 20px',
  }

  return (
    <div style={card}>
      {tokens.backgroundUrl && <div style={overlay} />}
      <div style={content}>

        {/* Logo */}
        {tokens.logoUrl && (
          <img src={tokens.logoUrl || undefined} alt="logo"
            style={{ height: 48, objectFit: 'contain', borderRadius: 6 }} />
        )}

        {/* Initiales */}
        {tokens.hostInitials && (
          <div style={{ ...accentStyle, fontSize: tokens.fontSizeTitle * 0.7,
            letterSpacing: 6 }}>
            {tokens.hostInitials}
          </div>
        )}

        {/* Ligne décorative */}
        <div style={{ width: 60, height: 1.5, background: tokens.colorAccent, opacity: .6 }} />

        {/* Titre */}
        <div style={titleStyle}>{eventTitle || "Nom de l'événement"}</div>

        {/* Message d'accueil */}
        {tokens.welcomeText && (
          <div style={welcomeStyle}>{tokens.welcomeText}</div>
        )}

        {/* Nom de l'invité */}
        {guestName && (
          <div style={{ ...accentStyle, fontSize: tokens.fontSizeBase + 1 }}>
            {guestName}
          </div>
        )}

        {/* Table */}
        <div style={tableBox}>
          <span style={{ fontSize: tokens.fontSizeBase - 2, opacity: .7,
            color: tokens.backgroundUrl ? '#fff' : tokens.colorText }}>
            {tokens.seatingLabel}
          </span>
          <div style={{ ...accentStyle, fontSize: tokens.fontSizeBase + 4, marginTop: 2 }}>
            7
          </div>
        </div>

        {/* Citation */}
        {tokens.quoteText && (
          <div style={{
            fontSize: tokens.fontSizeBase - 2,
            fontStyle: 'italic', opacity: .65,
            color: tokens.backgroundUrl ? '#fff' : tokens.colorText,
          }}>
            "{tokens.quoteText}"
          </div>
        )}

      </div>
    </div>
  )
}
