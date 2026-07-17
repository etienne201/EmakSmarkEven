import { Storage } from "../storage/storage";
import { AppError } from "../middleware/error-handler";

export class SetupService {
  static async getStatus(ownerId: string) {
    const config = await Storage.getEventConfig(ownerId);
    
    if (!config) {
      return { isConfigured: false, currentStep: 1, totalSteps: 5, eventId: ownerId };
    }

    return {
      isConfigured: config.status !== "draft" && config.setupCompleted === true,
      currentStep: config.setupStep || 1,
      totalSteps: 5,
      eventId: config.id || ownerId
    };
  }

  static async saveStepData(ownerId: string, step: number, data: any) {
    const config = (await Storage.getEventConfig(ownerId)) || { ownerId, id: ownerId };

    // Update step data
    if (step === 1) {
      config.title = data.title || data.eventName;
      config.description = data.description || null;
      config.eventType = data.eventType;
      config.language = data.language || "fr";
      config.date = data.date || new Date().toISOString();
      config.startTime = data.startTime || null;
      config.city = data.city || null;
      config.country = data.country || "Cameroun";
      config.location = data.location || null;
    } else if (step === 2) {
      config.sessions = data.sessions || [];
      config.specificFields = data.specificFields || {};
    } else if (step === 3) {
      config.paletteType = data.paletteType || "predefined";
      config.paletteId = data.paletteId || null;
      config.colorAccent = data.colorAccent || null;
      config.colorBackground = data.colorBackground || null;
      config.colorButton = data.colorButton || null;
      config.colorText = data.colorText || null;
      config.decorationStyle = data.decorationStyle || "minimal";
      config.logoUrl = data.logoUrl || null;
      config.backgroundUrl = data.backgroundUrl || null;
      config.galleryFileIds = data.galleryFileIds || [];
    } else if (step === 4) {
      config.qrEnabled = data.qrEnabled ?? true;
      config.qrType = data.qrType || "check_in";
      config.rsvpEnabled = data.rsvpEnabled ?? true;
      config.seatingPlanEnabled = data.seatingPlanEnabled ?? true;
      config.maxGuestsPerTable = data.maxGuestsPerTable || 10;
      config.showGuestNameOnCard = data.showGuestNameOnCard ?? true;
      config.showTableNumberOnCard = data.showTableNumberOnCard ?? true;
      config.hostInitials = data.hostInitials || null;
    } else if (step === 5) {
      config.typography = data.typography || "sans";
      config.fontSizeBase = data.fontSizeBase || 15;
      config.fontSizeTitle = data.fontSizeTitle || 28;
      config.spacing = data.spacing || "normal";
      config.borderRadius = data.borderRadius || "rounded";
      config.glassmorphism = data.glassmorphism || false;
      config.welcomeFr = data.welcomeFr || null;
      config.welcomeEn = data.welcomeEn || null;
      config.quoteFr = data.quoteFr || null;
      config.quoteEn = data.quoteEn || null;
      config.seatingLabelFr = data.seatingLabelFr || "Votre Table";
      config.seatingLabelEn = data.seatingLabelEn || "Your Table";
    }

    config.setupStep = Math.max(config.setupStep || 1, step + 1);
    config.updatedAt = new Date().toISOString();

    await Storage.saveEventConfig(config);
    return config;
  }

  static async finalize(ownerId: string) {
    const config = await Storage.getEventConfig(ownerId);
    if (!config) throw new AppError("Event configuration not found", 404);
    
    config.status = "active";
    config.setupCompleted = true;
    config.finalizedAt = new Date().toISOString();
    config.updatedAt = new Date().toISOString();

    await Storage.saveEventConfig(config);
    return config;
  }

  static async getStepData(ownerId: string, step: number) {
    const config = await Storage.getEventConfig(ownerId);
    return config;
  }
}
