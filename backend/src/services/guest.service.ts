import { Storage } from "../storage/storage";
import { GuestSchema } from "@backend/validations/guest.schema";
import { AppError } from "@backend/middleware/error-handler";
import { v4 as uuidv4 } from "uuid";

export class GuestService {
  static async getGuests(ownerId: string) {
    return Storage.getGuests(ownerId);
  }

  static async getGuestById(id: string, ownerId: string) {
    const guests = await Storage.getGuests(ownerId);
    return guests.find((g: any) => g.id.toString() === id.toString()) || null;
  }

  static async getGuestByToken(token: string) {
    const configs = await Storage.getAllEventConfigs();
    for (const config of configs) {
      const guests = await Storage.getGuests(config.ownerId);
      const guest = guests.find((g: any) => g.token === token);
      if (guest) {
        return {
          ...guest,
          event: config
        };
      }
    }
    return null;
  }

  static async saveGuest(data: any, ownerId: string) {
    const validated = GuestSchema.parse(data);
    const guests = await Storage.getGuests(ownerId);

    if (validated.id) {
      // Update existing guest
      const idx = guests.findIndex((g: any) => g.id.toString() === validated.id!.toString());
      if (idx === -1) throw new AppError("Guest not found", 404);
      
      guests[idx] = {
        ...guests[idx],
        fullName: validated.fullName,
        email: validated.email || null,
        phone: validated.phone || null,
        notes: validated.notes || null,
        language: validated.language || "fr",
        tableId: validated.tableId || null,
        rsvpStatus: validated.rsvpStatus || guests[idx].rsvpStatus || "pending",
        checkinStatus: validated.checkinStatus || guests[idx].checkinStatus || "not_arrived",
        dietaryRequirements: validated.dietaryRequirements || null,
        updatedAt: new Date().toISOString()
      };
      
      await Storage.saveGuests(guests, ownerId);
      return guests[idx];
    } else {
      // Create new guest
      const token = uuidv4();
      const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guest?token=${token}`;
      const newGuest = {
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fullName: validated.fullName,
        email: validated.email || null,
        phone: validated.phone || null,
        notes: validated.notes || null,
        language: validated.language || "fr",
        tableId: validated.tableId || null,
        token,
        invitationUrl,
        tokenExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        rsvpStatus: validated.rsvpStatus || "pending",
        checkinStatus: validated.checkinStatus || "not_arrived",
        dietaryRequirements: validated.dietaryRequirements || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      guests.push(newGuest);
      await Storage.saveGuests(guests, ownerId);
      return newGuest;
    }
  }

  static async deleteGuest(id: string, ownerId: string) {
    const guests = await Storage.getGuests(ownerId);
    const filtered = guests.filter((g: any) => g.id.toString() !== id.toString());
    await Storage.saveGuests(filtered, ownerId);
    
    // Also remove from attendance if present
    const attendance = await Storage.getAttendance(ownerId);
    const filteredAttendance = attendance.filter((a: any) => a.guestId.toString() !== id.toString());
    await Storage.saveAttendance(filteredAttendance, ownerId);

    return { success: true };
  }

  static async clearAll(ownerId: string) {
    await Storage.saveGuests([], ownerId);
    await Storage.saveAttendance([], ownerId);
    return { success: true };
  }

  static async bulkImport(guestsData: any[], ownerId: string) {
    const guests = await Storage.getGuests(ownerId);
    const results = [];
    
    for (const g of guestsData) {
      const token = uuidv4();
      const newGuest = {
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-bulk`,
        fullName: g.fullName || g.name || "Invité",
        email: g.email || null,
        phone: g.phone || null,
        language: g.language || g.lang || "fr",
        token,
        invitationUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guest?token=${token}`,
        tokenExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        rsvpStatus: "pending",
        checkinStatus: "not_arrived",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      guests.push(newGuest);
      results.push(newGuest);
    }
    
    await Storage.saveGuests(guests, ownerId);
    return { succeeded: guestsData.length, failed: 0, total: guestsData.length };
  }

  static async updateRsvp(guestId: string, status: "confirmed" | "declined", dietaryRequirements?: string) {
    const configs = await Storage.getAllEventConfigs();
    for (const config of configs) {
      const guests = await Storage.getGuests(config.ownerId);
      const idx = guests.findIndex((g: any) => g.id.toString() === guestId.toString());
      if (idx !== -1) {
        guests[idx].rsvpStatus = status;
        guests[idx].rsvpUpdatedAt = new Date().toISOString();
        guests[idx].dietaryRequirements = dietaryRequirements || null;
        guests[idx].updatedAt = new Date().toISOString();
        await Storage.saveGuests(guests, config.ownerId);
        return guests[idx];
      }
    }
    throw new AppError("Guest not found", 404);
  }

  static async checkIn(guestId: string, source: "qr_scan" | "manual" | "offline_sync" = "manual") {
    const configs = await Storage.getAllEventConfigs();
    for (const config of configs) {
      const guests = await Storage.getGuests(config.ownerId);
      const idx = guests.findIndex((g: any) => g.id.toString() === guestId.toString());
      if (idx !== -1) {
        if (guests[idx].checkinStatus === "arrived") {
          throw new AppError("Guest already checked in", 409);
        }
        
        guests[idx].checkinStatus = "arrived";
        guests[idx].checkedInAt = new Date().toISOString();
        guests[idx].checkinSource = source;
        guests[idx].updatedAt = new Date().toISOString();
        
        await Storage.saveGuests(guests, config.ownerId);

        // Also add to attendance list
        const attendance = await Storage.getAttendance(config.ownerId);
        attendance.push({
          guestId: guests[idx].id,
          fullName: guests[idx].fullName,
          status: "Présent",
          timestamp: new Date().toISOString()
        });
        await Storage.saveAttendance(attendance, config.ownerId);

        return guests[idx];
      }
    }
    throw new AppError("Guest not found", 404);
  }
}
