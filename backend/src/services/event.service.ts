import { Storage } from "../storage/storage";
import { AppError } from "../middleware/error-handler";
import { EventConfig } from "../eventConfig";

export class EventService {
  static async getConfig(ownerId: string): Promise<EventConfig | null> {
    return Storage.getEventConfig(ownerId);
  }

  static async saveConfig(data: any, ownerId: string) {
    const config = { ...data, ownerId };
    await Storage.saveEventConfig(config);
    return config;
  }

  static async updateStep(ownerId: string, step: number) {
    const config = await Storage.getEventConfig(ownerId);
    if (config) {
      config.setupStep = step;
      await Storage.saveEventConfig(config);
    }
    return config;
  }

  static async isBlocked(ownerId: string): Promise<boolean> {
    return false;
  }

  static async getAllEvents() {
    return Storage.getAllEventConfigs();
  }

  static async finalizeSetup(ownerId: string) {
    const config = await Storage.getEventConfig(ownerId);
    if (!config) throw new AppError("Configuration not found", 404);
    
    config.status = "active";
    config.setupCompleted = true;
    config.finalizedAt = new Date().toISOString();
    
    await Storage.saveEventConfig(config);
    return config;
  }
}
