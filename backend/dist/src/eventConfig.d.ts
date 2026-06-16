import { Language } from "./translations";
export { type Guest, type Table } from "./types";
export type EventType = "wedding" | "birthday" | "conference" | "gala" | "other";
export interface EventPalette {
    primary: string;
    primaryLight: string;
    secondary: string;
    secondaryDark: string;
    background: string;
    button: string;
    buttonText: string;
    textMain: string;
    textHeading: string;
}
export interface UISettings {
    fontFamily: "serif" | "sans" | "mono" | "outfit" | "inter";
    baseFontSize: number;
    headingFontSize: number;
    lineHeight: number;
    containerPadding: number;
    componentGap: number;
    contentAlignment: "left" | "center" | "right";
    buttonRadius: number;
    cardRadius: number;
    inputRadius: number;
    glassmorphism: boolean;
    animationsSpeed: "none" | "slow" | "normal" | "fast";
    shadowsIntensity: "none" | "soft" | "medium" | "strong";
    fontSizeBase: number;
    fontSizeTitle: number;
    spacing: "compact" | "normal" | "spacious";
    borderRadius: "sharp" | "soft" | "rounded" | "pill";
}
export type DecorationType = "floral" | "sparkle" | "confetti" | "minimal" | "corporate";
export interface Ceremony {
    id: string;
    type: "civil" | "religious" | "traditional" | "other";
    name: string;
    location: string;
    time: string;
    details?: string;
    requirements?: string[];
    cityHall?: {
        country: string;
        region: string;
        commune: string;
        venueName: string;
        address?: string;
        contact?: string;
        hours?: string;
        image?: string;
    };
    position: number;
}
export type DesignPersonality = "elegant-luxury" | "modern-minimal" | "floral-romantic" | "gold-prestige" | "afro-celebration" | "corporate-clean" | "night-party";
export interface CanvasElement {
    id: string;
    type: "text" | "image" | "icon" | "shape" | "flower";
    content: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
    style?: Record<string, any>;
    isSmartAligned?: boolean;
}
export interface SmartDesignSettings {
    personality: DesignPersonality;
    autoAlignEnabled: boolean;
    smartSpacingEnabled: boolean;
    colorHarmonyMode: "strict" | "adaptive" | "free";
    typographyMode: "auto-scale" | "manual";
    designScores: {
        readability: number;
        balance: number;
        elegance: number;
    };
    templateId?: string;
    dynamicValues?: Record<string, any>;
}
export interface EventConfig {
    eventType: EventType;
    eventName: string;
    eventSubtitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventVenue: string;
    eventDescription: string;
    palette: EventPalette;
    decorationType: DecorationType;
    qrEnabled: boolean;
    rsvpEnabled: boolean;
    seatingPlanEnabled: boolean;
    maxGuestsPerTable: number;
    showGuestNameOnCard: boolean;
    showTableNumberOnCard: boolean;
    qrType: "check-in" | "info";
    uiSettings: UISettings;
    hostInitials: string;
    logoUrl?: string;
    invitationBgUrl?: string;
    templateId: string;
    program?: string;
    ceremonies?: Ceremony[];
    galleryImages?: string[];
    galleryFileIds?: string[];
    sessions?: {
        id: string;
        name: string;
        startTime: string;
        endTime?: string | null;
        location?: string | null;
        details?: string | null;
        position: number;
    }[];
    customFields: Record<string, string>;
    specificFields: {
        unionTitle?: string;
        birthdayAge?: number;
        birthdayPersonName?: string;
        speakerNames?: string;
        videoLink?: string;
        organizer?: string;
        registrationUrl?: string;
        galaTheme?: string;
        dressCode?: string;
    };
    status: "draft" | "active" | "completed" | "archived";
    setupCompleted: boolean;
    setupStep: number;
    finalizedAt?: string;
    ownerId?: string;
    adminPassword?: string;
    isBlocked?: boolean;
    stats?: {
        totalGuests: number;
        presentCount: number;
    };
    defaultLang: Language;
    generatedTexts: {
        fr: GeneratedTexts;
        en: GeneratedTexts;
    };
    invitationImages: {
        fr: string;
        en: string;
    };
    welcomeFr: string;
    welcomeEn: string;
    quoteFr?: string;
    quoteEn?: string;
    seatingLabelFr: string;
    seatingLabelEn: string;
    typography: string;
    borderRadius: string;
    spacing: string;
    fontSizeBase: number;
    fontSizeTitle: number;
    glassmorphism: boolean;
    paletteType: string;
    paletteId: string;
    colorAccent: string;
    colorBackground: string;
    colorButton: string;
    colorText: string;
    smartDesign: SmartDesignSettings;
    layoutElements: CanvasElement[];
}
export interface GeneratedTexts {
    welcome: string;
    greeting: string;
    quote: string;
    scanLabel: string;
    ceremony: string;
    placement: string;
    tableLabel: string;
}
export declare const EVENT_TYPES: {
    value: EventType;
    labelFr: string;
    labelEn: string;
    icon: string;
}[];
export declare const PRESET_PALETTES: Record<EventType, EventPalette>;
export declare const DEFAULT_DECORATION: Record<EventType, DecorationType>;
export declare function generateDefaultTexts(eventType: EventType, eventName: string): {
    fr: GeneratedTexts;
    en: GeneratedTexts;
};
export declare const DEFAULT_EVENT_CONFIG: EventConfig;
export declare function formatEventDate(dateStr: string, lang: Language): string;
