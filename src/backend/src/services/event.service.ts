import { prisma } from "@backend/prisma";
import { AppError } from "@backend/middleware/error-handler";
import { EventConfig, generateDefaultTexts } from "../eventConfig";

export class EventService {
  static async getConfig(ownerId: string): Promise<EventConfig | null> {
    const event = await prisma.event.findFirst({
      where: { adminId: ownerId },
      include: {
        design: true,
        settings: true,
        sessions: true,
      }
    });

    if (!event) return null;

    // Map database fields back to frontend interface
    return {
      ownerId: event.adminId,
      eventName: event.title,
      eventSubtitle: (event as any).subtitle || "",
      eventDescription: event.description || "",
      eventType: event.eventType as any,
      eventDate: event.date.toISOString().split("T")[0],
      eventTime: event.startTime || "14:00",
      eventLocation: event.city || "",
      eventVenue: event.location || "",
      templateId: (event.design as any)?.templateId || "wedding-classic",
      generatedTexts: generateDefaultTexts(event.eventType as any, event.title),
      invitationImages: {
        fr: (event.design as any)?.bannerUrl || "",
        en: (event.design as any)?.bannerUrl || "",
      },
      status: event.status as any,
      defaultLang: event.language,
      
      palette: {
        primary: event.design?.colorAccent || "#313366",
        primaryLight: event.design?.colorAccent ? `${event.design?.colorAccent}22` : "#e1e2f0",
        secondary: "#10b981", // Default emerald
        secondaryDark: "#059669",
        background: event.design?.colorBackground || "#ffffff",
        button: event.design?.colorButton || "#313366",
        buttonText: "#ffffff",
        textMain: event.design?.colorText || "#000000",
        textHeading: event.design?.colorText || "#000000",
      },

      decorationType: (event.design?.decorationStyle as any) || "floral",
      
      uiSettings: {
        fontFamily: (event.design?.typography as any) || "serif",
        baseFontSize: 16,
        headingFontSize: 32,
        lineHeight: 1.5,
        containerPadding: 24,
        componentGap: 24,
        contentAlignment: "center",
        buttonRadius: 8,
        cardRadius: 16,
        inputRadius: 8,
        glassmorphism: event.design?.glassmorphism || false,
        animationsSpeed: "normal",
        shadowsIntensity: "medium",
        fontSizeBase: (event.design as any)?.fontSizeBase || 15,
        fontSizeTitle: (event.design as any)?.fontSizeTitle || 28,
        spacing: (event.design as any)?.spacing || "normal",
        borderRadius: (event.design as any)?.borderRadius || "rounded",
      },

      qrEnabled: event.settings?.qrEnabled ?? true,
      qrType: (event.settings?.qrType as any) || "check-in",
      rsvpEnabled: event.settings?.rsvpEnabled ?? true,
      seatingPlanEnabled: event.settings?.seatingPlanEnabled ?? true,
      maxGuestsPerTable: event.settings?.maxGuestsPerTable || 10,
      showGuestNameOnCard: event.settings?.showGuestNameOnCard ?? true,
      showTableNumberOnCard: event.settings?.showTableNumberOnCard ?? true,
      hostInitials: event.settings?.hostInitials || "",
      
      logoUrl: event.design?.logoUrl || "",
      invitationBgUrl: event.design?.bannerUrl || "",
      galleryImages: (event.galleryImages as string[]) || [],
      galleryFileIds: (event.design?.galleryFileIds as string[]) || [],
      customFields: (event.customFields as Record<string, string>) || {},
      specificFields: (event.specificFields as Record<string, string>) || {},

      typography: event.design?.typography || "serif",

      borderRadius: (event.design as any)?.borderRadius || "rounded",
      spacing: (event.design as any)?.spacing || "normal",
      fontSizeBase: (event.design as any)?.fontSizeBase || 15,
      fontSizeTitle: (event.design as any)?.fontSizeTitle || 28,
      glassmorphism: event.design?.glassmorphism || false,

      paletteType: event.design?.paletteType || "predefined",
      paletteId: event.design?.paletteId || "wedding",
      colorAccent: event.design?.colorAccent || "",
      colorBackground: event.design?.colorBackground || "",
      colorButton: event.design?.colorButton || "",
      colorText: event.design?.colorText || "",

      welcomeFr: event.design?.welcomeFr || "",
      welcomeEn: event.design?.welcomeEn || "",
      quoteFr: (event.design as any)?.quoteFr || "",
      quoteEn: (event.design as any)?.quoteEn || "",
      seatingLabelFr: (event.design as any)?.seatingLabelFr || "Votre Table",
      seatingLabelEn: (event.design as any)?.seatingLabelEn || "Your Table",

      // Smart Design Engine
      smartDesign: (event.design as any)?.smartDesign || {
        personality: "elegant-luxury",
        autoAlignEnabled: true,
        smartSpacingEnabled: true,
        colorHarmonyMode: "adaptive",
        typographyMode: "auto-scale",
        designScores: { readability: 100, balance: 100, elegance: 100 }
      },
      layoutElements: (event.design as any)?.layoutElements || [],

      // Setup State
      setupCompleted: event.setupCompleted,
      setupStep: event.setupStep,
      finalizedAt: (event as any).finalizedAt?.toISOString(),

      // Sessions
      sessions: event.sessions.map(s => ({
        id: s.id,
        name: s.name,
        startTime: s.startTime,
        endTime: s.endTime,
        location: s.location,
        details: s.details,
        position: s.position
      }))
    };
  }

  static async saveConfig(data: any, ownerId: string) {
    // Map frontend fields to database schema
    const title = data.eventName || data.title;
    if (!title) throw new AppError("Le nom de l'événement est requis", 400);

    const eventBase = {
      title: title,
      description: data.eventDescription || data.description || null,
      eventType: (data.eventType as any) || "wedding",
      date: data.eventDate ? new Date(data.eventDate) : new Date(),
      startTime: data.eventTime || data.startTime || null,
      city: data.eventLocation || data.city || null,
      location: data.eventVenue || data.location || null,
      status: (data.status as any) || "draft",
      language: (data.language as any) || (data.defaultLang as any) || "fr",
      finalizedAt: data.finalizedAt ? new Date(data.finalizedAt) : undefined,
      galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages.filter((img: string) => typeof img === "string" && !img.startsWith("data:")) : [],
      customFields: data.customFields || {},
      specificFields: data.specificFields || {},
      setupStep: data.setupStep || undefined,
      updatedAt: new Date()
    };

    const cleanUrl = (url: any) => typeof url === "string" && url.startsWith("data:") ? null : url;

    const designData = {
      paletteType: data.paletteType || "predefined",
      paletteId: data.paletteId || "wedding",
      colorAccent: data.palette?.primary || data.colorAccent || null,
      colorBackground: data.palette?.background || data.colorBackground || null,
      colorButton: data.palette?.button || data.colorButton || null,
      colorText: data.palette?.textMain || data.colorText || null,
      decorationStyle: data.decorationType || data.decorationStyle || "floral",
      typography: data.uiSettings?.fontFamily || data.typography || "sans",
      fontSizeBase: data.uiSettings?.fontSizeBase || data.fontSizeBase || 15,
      fontSizeTitle: data.uiSettings?.fontSizeTitle || data.fontSizeTitle || 28,
      spacing: data.uiSettings?.spacing || data.spacing || "normal",
      borderRadius: data.uiSettings?.borderRadius || data.borderRadius || "rounded",
      logoUrl: cleanUrl(data.logoUrl) || null,
      bannerUrl: cleanUrl(data.invitationBgUrl || data.backgroundUrl) || null,
      galleryFileIds: data.galleryFileIds || [],
      welcomeFr: data.welcomeFr || null,
      welcomeEn: data.welcomeEn || null,
      quoteFr: data.quoteFr || null,
      quoteEn: data.quoteEn || null,
      seatingLabelFr: data.seatingLabelFr || "Votre Table",
      seatingLabelEn: data.seatingLabelEn || "Your Table",
      glassmorphism: data.uiSettings?.glassmorphism ?? data.glassmorphism ?? false,
      smartDesign: data.smartDesign || null,
      layoutElements: data.layoutElements || null,
    };

    const settingsData = {
      qrEnabled: data.qrEnabled ?? true,
      qrType: data.qrType || "check_in",
      rsvpEnabled: data.rsvpEnabled ?? true,
      seatingPlanEnabled: data.seatingPlanEnabled ?? true,
      maxGuestsPerTable: data.maxGuestsPerTable || 10,
      showGuestNameOnCard: data.showGuestNameOnCard ?? true,
      showTableNumberOnCard: data.showTableNumberOnCard ?? true,
      hostInitials: data.hostInitials || null
    };

    return prisma.event.upsert({
      where: { adminId: ownerId },
      update: { 
        ...eventBase,
        design: designData ? {
          upsert: {
            create: designData,
            update: designData
          }
        } : undefined,
        settings: {
          upsert: {
            create: settingsData,
            update: settingsData
          }
        },
        sessions: data.sessions ? {
          deleteMany: {},
          create: data.sessions.map((s: any, idx: number) => ({
            name: s.name,
            startTime: s.startTime || "00:00",
            endTime: s.endTime || null,
            location: s.location || s.venue || null,
            details: s.details || null,
            position: s.position ?? idx
          }))
        } : undefined
      } as any,
      create: {
        adminId: ownerId,
        ...eventBase,
        design: designData ? {
          create: designData
        } : undefined,
        settings: {
          create: settingsData
        },
        sessions: data.sessions ? {
          create: data.sessions.map((s: any) => ({
            name: s.name,
            startTime: s.startTime,
            endTime: s.endTime,
            location: s.location,
            details: s.details,
            position: s.position || 0
          }))
        } : undefined
      } as any
    });
  }

  static async updateStep(ownerId: string, step: number) {
    return prisma.event.update({
      where: { adminId: ownerId },
      data: { setupStep: step }
    });
  }

  static async isBlocked(ownerId: string): Promise<boolean> {
    const admin = await prisma.admins.findUnique({ where: { id: ownerId } });
    return admin?.status === "blocked";
  }

  static async getAllEvents() {
    const events = await prisma.event.findMany({
      include: {
        admin: { select: { id: true, name: true, email: true, status: true, passwordHash: true } },
        _count: { select: { guests: true, tables: true } },
        design: true,
        settings: true,
        sessions: true
      },
      orderBy: { createdAt: "desc" }
    });

    return events.map(event => ({
      ownerId: event.adminId,
      eventName: event.title,
      eventDescription: event.description || "",
      eventType: event.eventType as any,
      eventDate: event.date.toISOString().split("T")[0],
      eventTime: event.startTime || "14:00",
      eventLocation: event.city || "",
      eventVenue: event.location || "",
      status: event.status as any,
      adminPassword: event.admin?.passwordHash,
      isBlocked: event.admin?.status === "blocked",
      stats: {
        totalGuests: event._count?.guests || 0,
        presentCount: 0 // Will need a separate count if needed, or update _count
      },
      logoUrl: event.design?.logoUrl || "",
      finalizedAt: event.finalizedAt?.toISOString(),
      specificFields: (event.specificFields as Record<string, string>) || {},
      galleryFileIds: (event.design?.galleryFileIds as string[]) || [],
      sessions: event.sessions.map(s => ({
        id: s.id,
        name: s.name,
        startTime: s.startTime,
        endTime: s.endTime,
        location: s.location,
        details: s.details,
        position: s.position
      }))
    }));
  }

  static async finalizeSetup(ownerId: string) {
    return prisma.event.update({
      where: { adminId: ownerId },
      data: { 
        status: "active", 
        setupCompleted: true,
        finalizedAt: new Date()
      }
    });
  }
}
