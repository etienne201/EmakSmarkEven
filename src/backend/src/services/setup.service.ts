import { prisma } from "@backend/prisma";
import { AppError } from "@backend/middleware/error-handler";

export class SetupService {
  static async getStatus(ownerId: string) {
    const event = await prisma.event.findFirst({
      where: { adminId: ownerId },
      include: { sessions: true, design: true }
    });
    
    if (!event) return { isConfigured: false, currentStep: 1 };

    let currentStep = 1;
    if (event.title && event.date) currentStep = 2;
    if (event.sessions.length > 0) currentStep = 3;
    if (event.design) currentStep = 4;

    return {
      isConfigured: event.status !== "draft" && event.setupCompleted,
      currentStep: event.setupStep || 1,
      totalSteps: 5,
      eventId: event.id
    };
  }

  static async saveStepData(ownerId: string, step: number, data: any) {
    // Ensure the Admin record exists to prevent Foreign Key constraint violations
    const adminExists = await prisma.admins.findUnique({ where: { id: ownerId } });
    if (!adminExists) {
      await prisma.admins.create({
        data: {
          id: ownerId,
          eventId: `EV-${ownerId.substring(0, 6).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
          name: ownerId === "default" ? "Default Organizer" : "Platform Admin",
          passwordHash: "auto-generated-stub",
          status: "active"
        }
      });
    }

    if (step === 1) {
      // Step 1: 2a & 2b — General Info & Date/Place
      return prisma.event.upsert({
        where: { adminId: ownerId },
        update: {
          title: data.title || data.eventName,
          description: data.description || null,
          eventType: data.eventType as any,
          language: data.language as any || "fr",
          date: data.date ? new Date(data.date) : new Date(),
          startTime: data.startTime || null,
          city: data.city || null,
          country: data.country || "Cameroun",
          location: data.location || null,
          setupStep: 2,
          updatedAt: new Date()
        },
        create: {
          adminId: ownerId,
          title: data.title || data.eventName,
          description: data.description || null,
          eventType: data.eventType as any,
          language: data.language as any || "fr",
          date: data.date ? new Date(data.date) : new Date(),
          startTime: data.startTime || null,
          city: data.city || null,
          country: data.country || "Cameroun",
          location: data.location || null,
          status: "draft",
          setupStep: 2
        }
      });
    }

    if (step === 2) {
      // Step 2: 2c & 2d — Sessions & Specific Fields
      let event = await prisma.event.findFirst({ where: { adminId: ownerId } });
      if (!event) {
        event = await prisma.event.create({
          data: {
            adminId: ownerId,
            title: "Nouvel Événement",
            eventType: "wedding",
            date: new Date(),
            setupStep: 2
          }
        });
      }

      if (data.sessions) {
        await prisma.session.deleteMany({ where: { eventId: event.id } });
        await prisma.event.update({
          where: { id: event.id },
          data: {
            sessions: {
              create: data.sessions.map((s: any, idx: number) => ({
                name: s.name,
                startTime: s.startTime || "00:00",
                endTime: s.endTime || null,
                location: s.venue || s.location || null,
                details: s.details || null,
                position: s.position ?? idx
              }))
            }
          }
        });
      }

      return prisma.event.update({
        where: { id: event.id },
        data: {
          specificFields: data.specificFields || {},
          setupStep: 3
        }
      });
    }

    if (step === 3) {
      // Step 3: 3a & 3b — Theme & Media
      // find the event first — upsert on adminId is not supported by Prisma update
      let event = await prisma.event.findFirst({ where: { adminId: ownerId } });
      if (!event) {
        // Auto-create a stub so step 3 can proceed even if step 1 was skipped
        event = await prisma.event.create({
          data: {
            adminId: ownerId,
            title: "Nouvel Événement",
            eventType: "wedding",
            date: new Date(),
            setupStep: 3
          }
        });
      }

      const designPayload = {
        paletteType: data.paletteType || "predefined",
        paletteId: data.paletteId || null,
        colorAccent: data.colorAccent || null,
        colorBackground: data.colorBackground || null,
        colorButton: data.colorButton || null,
        colorText: data.colorText || null,
        decorationStyle: data.decorationStyle || "minimal",
        logoUrl: data.logoUrl || null,
        bannerUrl: data.backgroundUrl || null,
        galleryFileIds: data.galleryFileIds || []
      };

      return prisma.event.update({
        where: { id: event.id },
        data: {
          setupStep: 4,
          design: {
            upsert: {
              create: designPayload,
              update: designPayload
            }
          }
        }
      });
    }

    if (step === 4) {
      // Step 4: 4a-4d — Settings
      const event = await prisma.event.findFirst({ where: { adminId: ownerId } });
      if (!event) throw new AppError("Event not found", 404);
      return prisma.event.update({
        where: { id: event.id },
        data: {
          setupStep: 5,
          settings: {
            upsert: {
              update: {
                qrEnabled: data.qrEnabled ?? true,
                qrType: data.qrType || "check_in",
                rsvpEnabled: data.rsvpEnabled ?? true,
                seatingPlanEnabled: data.seatingPlanEnabled ?? true,
                maxGuestsPerTable: data.maxGuestsPerTable || 10,
                showGuestNameOnCard: data.showGuestNameOnCard ?? true,
                showTableNumberOnCard: data.showTableNumberOnCard ?? true,
                hostInitials: data.hostInitials || null,
              },
              create: {
                qrEnabled: data.qrEnabled ?? true,
                qrType: data.qrType || "check_in",
                rsvpEnabled: data.rsvpEnabled ?? true,
                seatingPlanEnabled: data.seatingPlanEnabled ?? true,
                maxGuestsPerTable: data.maxGuestsPerTable || 10,
                showGuestNameOnCard: data.showGuestNameOnCard ?? true,
                showTableNumberOnCard: data.showTableNumberOnCard ?? true,
                hostInitials: data.hostInitials || null,
              }
            }
          }
        }
      });
    }

    if (step === 5) {
      // Step 5: 5a & 5b — Professional Refinement
      const ev5 = await prisma.event.findFirst({ where: { adminId: ownerId } });
      if (!ev5) throw new AppError("Event not found — complete step 1 first", 404);
      return prisma.event.update({
        where: { id: ev5.id },
        data: {
          design: {
            update: {
              typography: data.typography || "sans",
              fontSizeBase: data.fontSizeBase || 15,
              fontSizeTitle: data.fontSizeTitle || 28,
              spacing: data.spacing || "normal",
              borderRadius: data.borderRadius || "rounded",
              glassmorphism: data.glassmorphism || false,
              welcomeFr: data.welcomeFr || null,
              welcomeEn: data.welcomeEn || null,
              quoteFr: data.quoteFr || null,
              quoteEn: data.quoteEn || null,
              seatingLabelFr: data.seatingLabelFr || "Votre Table",
              seatingLabelEn: data.seatingLabelEn || "Your Table"
            } as any
          }
        }
      });
    }
    
    return this.getStatus(ownerId);
  }

  static async finalize(ownerId: string) {
    const evF = await prisma.event.findFirst({ where: { adminId: ownerId } });
    if (!evF) throw new AppError("Event not found", 404);
    return prisma.event.update({
      where: { id: evF.id },
      data: { 
        status: "active", 
        setupCompleted: true, 
        finalizedAt: new Date(),
        updatedAt: new Date() 
      }
    });
  }

  static async getStepData(ownerId: string, step: number) {
    return prisma.event.findFirst({
      where: { adminId: ownerId },
      include: { sessions: true, design: true, settings: true }
    });
  }
}
