"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EVENT_CONFIG = exports.DEFAULT_DECORATION = exports.PRESET_PALETTES = exports.EVENT_TYPES = void 0;
exports.generateDefaultTexts = generateDefaultTexts;
exports.formatEventDate = formatEventDate;
exports.EVENT_TYPES = [
    { value: "wedding", labelFr: "Mariage", labelEn: "Wedding", icon: "💍" },
    { value: "birthday", labelFr: "Anniversaire", labelEn: "Birthday", icon: "🎂" },
    { value: "conference", labelFr: "Conférence", labelEn: "Conference", icon: "🎤" },
    { value: "gala", labelFr: "Gala / Soirée", labelEn: "Gala / Party", icon: "👑" },
    { value: "other", labelFr: "Autre", labelEn: "Other", icon: "✨" },
];
exports.PRESET_PALETTES = {
    wedding: {
        primary: "#313366",
        primaryLight: "#e1e2f0",
        secondary: "#228b22",
        secondaryDark: "#1b5e20",
        background: "#ffffff",
        button: "#313366",
        buttonText: "#ffffff",
        textMain: "#000000",
        textHeading: "#000000",
    },
    birthday: {
        primary: "#e11d48",
        primaryLight: "#ffe4e6",
        secondary: "#7c3aed",
        secondaryDark: "#5b21b6",
        background: "#fef7ff",
        button: "#e11d48",
        buttonText: "#ffffff",
        textMain: "#4b5563",
        textHeading: "#111827",
    },
    conference: {
        primary: "#1e40af",
        primaryLight: "#dbeafe",
        secondary: "#0f766e",
        secondaryDark: "#134e4a",
        background: "#f0f9ff",
        button: "#1e40af",
        buttonText: "#ffffff",
        textMain: "#4b5563",
        textHeading: "#111827",
    },
    gala: {
        primary: "#171717",
        primaryLight: "#e5e5e5",
        secondary: "#b45309",
        secondaryDark: "#92400e",
        background: "#fafaf9",
        button: "#171717",
        buttonText: "#ffffff",
        textMain: "#4b5563",
        textHeading: "#111827",
    },
    other: {
        primary: "#6d28d9",
        primaryLight: "#ede9fe",
        secondary: "#0891b2",
        secondaryDark: "#155e75",
        background: "#f5f3ff",
        button: "#6d28d9",
        buttonText: "#ffffff",
        textMain: "#4b5563",
        textHeading: "#111827",
    },
};
exports.DEFAULT_DECORATION = {
    wedding: "floral",
    birthday: "confetti",
    conference: "corporate",
    gala: "sparkle",
    other: "minimal",
};
function generateDefaultTexts(eventType, eventName) {
    const textsByType = {
        wedding: {
            fr: {
                welcome: `Bienvenue au Mariage de`,
                greeting: "Ravi de vous voir,",
                quote: "\"L'amour est le plus beau des voyages.\"",
                scanLabel: "SCANNEZ-MOI • Accès & Placement",
                ceremony: "Cérémonie de Mariage",
                placement: "Votre Placement",
                tableLabel: "Table",
            },
            en: {
                welcome: `Welcome to the Wedding of`,
                greeting: "Happy to see you,",
                quote: "\"Love is the most beautiful journey.\"",
                scanLabel: "SCAN ME • Access & Seating",
                ceremony: "Wedding Ceremony",
                placement: "Your Seating",
                tableLabel: "Table",
            },
        },
        birthday: {
            fr: {
                welcome: `Bienvenue à l'Anniversaire de`,
                greeting: "Heureux de vous compter parmi nous,",
                quote: "\"La vie est une fête, célébrons-la !\"",
                scanLabel: "SCANNEZ-MOI • Accès Invité",
                ceremony: "Fête d'Anniversaire",
                placement: "Votre Place",
                tableLabel: "Table",
            },
            en: {
                welcome: `Welcome to the Birthday of`,
                greeting: "Happy to have you with us,",
                quote: "\"Life is a party, let's celebrate!\"",
                scanLabel: "SCAN ME • Guest Access",
                ceremony: "Birthday Party",
                placement: "Your Seat",
                tableLabel: "Table",
            },
        },
        conference: {
            fr: {
                welcome: `Bienvenue à`,
                greeting: "Nous sommes ravis de votre participation,",
                quote: "\"Le savoir est la clé du progrès.\"",
                scanLabel: "SCANNEZ-MOI • Badge & Accès",
                ceremony: "Conférence",
                placement: "Votre Section",
                tableLabel: "Section",
            },
            en: {
                welcome: `Welcome to`,
                greeting: "We're delighted to have you,",
                quote: "\"Knowledge is the key to progress.\"",
                scanLabel: "SCAN ME • Badge & Access",
                ceremony: "Conference",
                placement: "Your Section",
                tableLabel: "Section",
            },
        },
        gala: {
            fr: {
                welcome: `Bienvenue au Gala`,
                greeting: "Nous sommes honorés de votre présence,",
                quote: "\"L'élégance est la seule beauté qui ne se fane jamais.\"",
                scanLabel: "SCANNEZ-MOI • Accès VIP",
                ceremony: "Soirée de Gala",
                placement: "Votre Placement",
                tableLabel: "Table",
            },
            en: {
                welcome: `Welcome to the Gala`,
                greeting: "We are honored by your presence,",
                quote: "\"Elegance is the only beauty that never fades.\"",
                scanLabel: "SCAN ME • VIP Access",
                ceremony: "Gala Evening",
                placement: "Your Seating",
                tableLabel: "Table",
            },
        },
        other: {
            fr: {
                welcome: `Bienvenue à`,
                greeting: "Ravi de vous voir,",
                quote: "\"Les plus beaux moments sont ceux qu'on partage.\"",
                scanLabel: "SCANNEZ-MOI • Accès Événement",
                ceremony: "Événement",
                placement: "Votre Place",
                tableLabel: "Groupe",
            },
            en: {
                welcome: `Welcome to`,
                greeting: "Happy to see you,",
                quote: "\"The best moments are the ones we share.\"",
                scanLabel: "SCAN ME • Event Access",
                ceremony: "Event",
                placement: "Your Seat",
                tableLabel: "Group",
            },
        },
    };
    return textsByType[eventType];
}
exports.DEFAULT_EVENT_CONFIG = {
    eventType: "wedding",
    eventName: "Danie & John",
    eventSubtitle: "Cérémonie de Mariage",
    eventDate: "2026-06-06",
    eventTime: "14:00",
    eventLocation: "Douala",
    eventVenue: "",
    eventDescription: "",
    palette: exports.PRESET_PALETTES.wedding,
    decorationType: "floral",
    qrEnabled: true,
    rsvpEnabled: true,
    seatingPlanEnabled: true,
    maxGuestsPerTable: 10,
    showGuestNameOnCard: true,
    showTableNumberOnCard: true,
    qrType: "check-in",
    uiSettings: {
        fontFamily: "serif",
        baseFontSize: 16,
        headingFontSize: 32,
        lineHeight: 1.5,
        containerPadding: 24,
        componentGap: 24,
        contentAlignment: "center",
        buttonRadius: 8,
        cardRadius: 16,
        inputRadius: 8,
        glassmorphism: true,
        animationsSpeed: "normal",
        shadowsIntensity: "medium",
        fontSizeBase: 15,
        fontSizeTitle: 28,
        spacing: "normal",
        borderRadius: "rounded"
    },
    hostInitials: "DJ",
    logoUrl: "",
    invitationBgUrl: "",
    templateId: "wedding-classic",
    program: "14:00 - Cérémonie Religieuse\n16:00 - Cocktail & Photos\n19:00 - Réception & Dîner\n22:00 - Soirée Dansante",
    ceremonies: [
        {
            id: "1",
            type: "civil",
            name: "Mariage Civil",
            location: "Hôtel de Ville",
            time: "10:00",
            details: "Cérémonie officielle",
            requirements: ["Acte de naissance", "Certificat de célibat", "Témoins"],
            position: 1
        }
    ],
    galleryImages: [],
    customFields: {},
    ownerId: "UserEven",
    adminPassword: "",
    isBlocked: false,
    defaultLang: "fr",
    generatedTexts: generateDefaultTexts("wedding", "Danie & John"),
    invitationImages: {
        fr: "/images/InvitaionDanie&johnFr.png",
        en: "/images/InvitaionDanie&johnEN.png",
    },
    galleryFileIds: [],
    sessions: [],
    welcomeFr: "Bienvenue au Mariage de Danie & John",
    welcomeEn: "Welcome to the Wedding of Danie & John",
    quoteFr: "\"L'amour est le plus beau des voyages.\"",
    quoteEn: "\"Love is the most beautiful journey.\"",
    seatingLabelFr: "Votre Table",
    seatingLabelEn: "Your Table",
    typography: "serif",
    borderRadius: "rounded",
    spacing: "normal",
    fontSizeBase: 15,
    fontSizeTitle: 28,
    glassmorphism: true,
    paletteType: "predefined",
    paletteId: "wedding",
    colorAccent: "#313366",
    colorBackground: "#ffffff",
    colorButton: "#313366",
    colorText: "#000000",
    status: "draft",
    setupCompleted: false,
    setupStep: 1,
    specificFields: {},
    smartDesign: {
        personality: "elegant-luxury",
        autoAlignEnabled: true,
        smartSpacingEnabled: true,
        colorHarmonyMode: "adaptive",
        typographyMode: "auto-scale",
        designScores: { readability: 100, balance: 100, elegance: 100 },
        templateId: "wedding-luxury-green",
        dynamicValues: {}
    },
    layoutElements: [],
};
function formatEventDate(dateStr, lang) {
    if (!dateStr)
        return "";
    try {
        const date = new Date(dateStr + "T00:00:00");
        return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }
    catch {
        return dateStr;
    }
}
//# sourceMappingURL=eventConfig.js.map