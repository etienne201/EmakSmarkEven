// Textes et styles par défaut selon le type d'événement
export const DESIGN_DEFAULTS: Record<string, {
  palette:         { accent: string; background: string; button: string; text: string }
  decorationStyle: string
  typography:      string
  welcome:         { fr: string; en: string }
  quote:           { fr: string; en: string }
  seatingLabel:    { fr: string; en: string }
  logoPlaceholder: string
  backgroundPlaceholder: string
}> = {
  wedding: {
    palette: { accent:'#D4AF37', background:'#FFFFF0', button:'#8B7355', text:'#2C2C2C' },
    decorationStyle: 'floral',
    typography: 'serif',
    welcome: {
      fr: 'Nous avons la joie de vous inviter à notre mariage',
      en: 'We joyfully invite you to celebrate our wedding',
    },
    quote: {
      fr: "L'amour est la plus belle des aventures",
      en: 'Love is the greatest adventure',
    },
    seatingLabel: { fr: 'Votre Table', en: 'Your Table' },
    logoPlaceholder: '/defaults/wedding/logo.png',
    backgroundPlaceholder: '/defaults/wedding/background.jpg',
  },
  birthday: {
    palette: { accent:'#FF6B6B', background:'#FFF8F0', button:'#E0504A', text:'#1A0505' },
    decorationStyle: 'confetti',
    typography: 'sans',
    welcome: {
      fr: 'Vous êtes invité à célébrer avec nous !',
      en: 'You are invited to celebrate with us!',
    },
    quote: { fr: 'La fête commence ici', en: 'The celebration starts here' },
    seatingLabel: { fr: 'Votre Siège', en: 'Your Seat' },
    logoPlaceholder: '/defaults/birthday/logo.png',
    backgroundPlaceholder: '/defaults/birthday/background.jpg',
  },
  conference: {
    palette: { accent:'#1E40AF', background:'#F8FAFF', button:'#1A35A0', text:'#0A1025' },
    decorationStyle: 'corporate',
    typography: 'sans',
    welcome: {
      fr: 'Bienvenue à notre conférence',
      en: 'Welcome to our conference',
    },
    quote: { fr: 'Ensemble, construisons demain', en: 'Together, we build tomorrow' },
    seatingLabel: { fr: 'Votre Place', en: 'Your Seat' },
    logoPlaceholder: '/defaults/conference/logo.png',
    backgroundPlaceholder: '/defaults/conference/background.jpg',
  },
  gala: {
    palette: { accent:'#D4AF37', background:'#0A0A0A', button:'#B8960C', text:'#F5F5F0' },
    decorationStyle: 'stars',
    typography: 'serif',
    welcome: {
      fr: 'Vous êtes cordialement invité à notre Gala',
      en: 'You are cordially invited to our Gala',
    },
    quote: { fr: "Une soirée d'exception vous attend", en: 'An exceptional evening awaits' },
    seatingLabel: { fr: 'Votre Table', en: 'Your Table' },
    logoPlaceholder: '/defaults/gala/logo.png',
    backgroundPlaceholder: '/defaults/gala/background.jpg',
  },
  other: {
    palette: { accent:'#6366F1', background:'#F9FAFB', button:'#4F46E5', text:'#111827' },
    decorationStyle: 'minimal',
    typography: 'sans',
    welcome: {
      fr: 'Vous êtes invité à notre événement',
      en: 'You are invited to our event',
    },
    quote: { fr: '', en: '' },
    seatingLabel: { fr: 'Votre Table', en: 'Your Table' },
    logoPlaceholder: '/defaults/other/logo.png',
    backgroundPlaceholder: '/defaults/other/background.jpg',
  },
}
