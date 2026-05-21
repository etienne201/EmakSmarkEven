import { TemplateDefinition } from "../templateEngine";

export const TEMPLATE_PRESETS: TemplateDefinition[] = [
  {
    id: "wedding-luxury-green",
    name: "Mariage Vert Premium",
    category: "wedding",
    style: "luxury",
    culture: "afro-modern",
    thumbnailUrl: "/images/templates/wedding-green-thumb.jpg",
    backgroundUrl: "/images/templates/wedding-green-bg.jpg",
    width: 800,
    height: 1200,
    themes: [
      {
        id: "emerald-gold",
        name: "Émeraude & Or",
        palette: {
          primary: "#0f5132",
          secondary: "#d4af37",
          accent: "#ffffff",
          background: "#f4f9f4",
          text: "#1a3a2b"
        }
      },
      {
        id: "ruby-gold",
        name: "Rubis & Or",
        palette: {
          primary: "#800020",
          secondary: "#d4af37",
          accent: "#ffffff",
          background: "#fcf8f8",
          text: "#400010"
        }
      },
      {
        id: "royal-gold",
        name: "Bleu Royal & Or",
        palette: {
          primary: "#0b3c5d",
          secondary: "#d4af37",
          accent: "#ffffff",
          background: "#f5f7fa",
          text: "#062233"
        }
      }
    ],
    dynamicZones: [
      {
        id: "groom_name",
        label: "Nom du Marié",
        type: "text",
        role: "groom_name",
        x: 400,
        y: 200,
        maxWidth: 600,
        stylePreset: {
          fontFamily: "Playfair Display, serif",
          fontSize: 48,
          fill: "#d4af37",
          align: "center",
          letterSpacing: 2
        },
        rules: {
          maxCharacters: 20,
          minFontSize: 24,
          autoScale: true
        },
        defaultValue: "Aloys"
      },
      {
        id: "bride_name",
        label: "Nom de la Mariée",
        type: "text",
        role: "bride_name",
        x: 400,
        y: 300,
        maxWidth: 600,
        stylePreset: {
          fontFamily: "Playfair Display, serif",
          fontSize: 48,
          fill: "#d4af37",
          align: "center",
          letterSpacing: 2
        },
        rules: {
          maxCharacters: 20,
          minFontSize: 24,
          autoScale: true
        },
        defaultValue: "Belviane"
      },
      {
        id: "event_date",
        label: "Date de l'événement",
        type: "date",
        role: "event_date",
        x: 400,
        y: 420,
        maxWidth: 500,
        stylePreset: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: 24,
          fill: "#0f5132",
          align: "center"
        },
        defaultValue: "2026-08-22"
      },
      {
        id: "quote",
        label: "Citation",
        type: "text",
        role: "quote",
        x: 400,
        y: 550,
        maxWidth: 500,
        stylePreset: {
          fontFamily: "Lora, serif",
          fontSize: 20,
          fill: "#555555",
          align: "center"
        },
        rules: {
          maxCharacters: 120,
          maxLines: 3,
          autoScale: true
        },
        defaultValue: "L'amour est le plus beau voyage de la vie..."
      },
      {
        id: "dress_code",
        label: "Dress Code",
        type: "text",
        role: "dress_code",
        x: 400,
        y: 700,
        maxWidth: 550,
        stylePreset: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: 18,
          fill: "#0f5132",
          align: "center"
        },
        defaultValue: "Vert émeraude & touches dorées"
      }
    ]
  },
  {
    id: "invitation-premium",
    name: "Invitation Premium",
    category: "wedding",
    style: "modern",
    thumbnailUrl: "/images/templates/invitation-premium-thumb.jpg",
    backgroundUrl: "/images/templates/invitation-premium-bg.jpg",
    width: 800,
    height: 1200,
    themes: [
      {
        id: "classic-navy",
        name: "Bleu Marine & Or",
        palette: {
          primary: "#313366",
          secondary: "#d4af37",
          accent: "#ffffff",
          background: "#ffffff",
          text: "#111111"
        }
      },
      {
        id: "platinum-black",
        name: "Platinum & Noir",
        palette: {
          primary: "#111111",
          secondary: "#e5e5e5",
          accent: "#ffffff",
          background: "#ffffff",
          text: "#111111"
        }
      },
      {
        id: "rose-gold",
        name: "Or Rose & Blanc",
        palette: {
          primary: "#b76e79",
          secondary: "#d4af37",
          accent: "#ffffff",
          background: "#fff5f5",
          text: "#5c2a33"
        }
      }
    ],
    dynamicZones: [
      {
        id: "hosts",
        label: "Hôtes",
        type: "text",
        role: "hosts",
        x: 400,
        y: 180,
        maxWidth: 500,
        stylePreset: {
          fontFamily: "Inter, sans-serif",
          fontSize: 22,
          fill: "#313366",
          align: "center"
        },
        defaultValue: "Danie & John"
      },
      {
        id: "contacts",
        label: "Contacts",
        type: "list",
        role: "contacts",
        x: 400,
        y: 650,
        maxWidth: 500,
        stylePreset: {
          fontFamily: "Inter, sans-serif",
          fontSize: 16,
          fill: "#313366",
          align: "center"
        },
        defaultValue: ["+237 677 88 99 00", "contact@emak.com"]
      },
      {
        id: "qrcode",
        label: "QR Code Invitation",
        type: "qrcode",
        role: "qrcode",
        x: 325, // Center QR (width 150) -> 400 - 150/2 = 325
        y: 800,
        width: 150,
        stylePreset: {},
        defaultValue: "https://emak.event/scan"
      }
    ]
  }
];
