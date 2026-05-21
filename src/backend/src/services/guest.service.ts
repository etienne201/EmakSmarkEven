import { prisma } from "@backend/prisma";
import { GuestSchema } from "@backend/validations/guest.schema";
import { AppError } from "@backend/middleware/error-handler";
import { v4 as uuidv4 } from "uuid";

export class GuestService {
  static async getGuests(ownerId: string) {
    return prisma.guest.findMany({
      where: { event: { adminId: ownerId } },
      include: { table: true },
      orderBy: { fullName: "asc" }
    });
  }

  static async getGuestById(id: string, ownerId: string) {
    return prisma.guest.findFirst({
      where: { id, event: { adminId: ownerId } },
      include: { table: true }
    });
  }

  static async getGuestByToken(token: string) {
    return prisma.guest.findUnique({
      where: { token },
      include: {
        event: {
          include: { design: true, settings: true, sessions: true }
        },
        table: true
      }
    });
  }

  static async saveGuest(data: any, ownerId: string) {
    const validated = GuestSchema.parse(data);

    const event = await prisma.event.findFirst({ where: { adminId: ownerId } });
    if (!event) {
      throw new AppError("No event found for this owner. Please create an event first.", 404);
    }

    if (validated.id) {
      // Update existing guest
      return prisma.guest.update({
        where: { id: validated.id },
        data: {
          fullName: validated.fullName,
          email: validated.email || null,
          phone: validated.phone || null,
          notes: validated.notes || null,
          language: validated.language || "fr",
          tableId: validated.tableId || null,
          rsvpStatus: validated.rsvpStatus as any,
          checkinStatus: validated.checkinStatus as any,
          dietaryRequirements: validated.dietaryRequirements || null,
        }
      });
    } else {
      // Create new guest
      const token = uuidv4(); // Unique secure token
      const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guest?token=${token}`;

      return prisma.guest.create({
        data: {
          eventId: event.id,
          fullName: validated.fullName,
          email: validated.email || null,
          phone: validated.phone || null,
          notes: validated.notes || null,
          language: validated.language || "fr",
          tableId: validated.tableId || null,
          token,
          invitationUrl,
          tokenExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          rsvpStatus: (validated.rsvpStatus as any) || "pending",
          checkinStatus: (validated.checkinStatus as any) || "not_arrived",
          dietaryRequirements: validated.dietaryRequirements || null,
        }
      });
    }
  }

  static async deleteGuest(id: string, ownerId: string) {
    return prisma.guest.delete({
      where: { id, event: { adminId: ownerId } }
    });
  }

  static async clearAll(ownerId: string) {
    return prisma.guest.deleteMany({
      where: { event: { adminId: ownerId } }
    });
  }

  /**
   * Bulk import guests from CSV/JSON
   */
  static async bulkImport(guests: any[], ownerId: string) {
    const event = await prisma.event.findFirst({ where: { adminId: ownerId } });
    if (!event) throw new AppError("No event found for this owner.", 404);

    const results = await Promise.allSettled(
      guests.map(async (g) => {
        const token = uuidv4();
        return prisma.guest.create({
          data: {
            eventId: event.id,
            fullName: g.fullName || g.name || "Invité",
            email: g.email || null,
            phone: g.phone || null,
            language: g.language || g.lang || "fr",
            token,
            invitationUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guest?token=${token}`,
            tokenExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            rsvpStatus: "pending",
            checkinStatus: "not_arrived",
          }
        });
      })
    );

    const succeeded = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;
    return { succeeded, failed, total: guests.length };
  }

  /**
   * Update RSVP status for a guest (called from public guest page)
   */
  static async updateRsvp(guestId: string, status: "confirmed" | "declined", dietaryRequirements?: string) {
    return prisma.guest.update({
      where: { id: guestId },
      data: {
        rsvpStatus: status,
        rsvpUpdatedAt: new Date(),
        dietaryRequirements: dietaryRequirements || null,
      }
    });
  }

  /**
   * Check in a guest (scan QR or manual)
   */
  static async checkIn(guestId: string, source: "qr_scan" | "manual" | "offline_sync" = "manual") {
    const guest = await prisma.guest.findUnique({ where: { id: guestId } });
    if (!guest) throw new AppError("Guest not found", 404);
    if (guest.checkinStatus === "arrived") throw new AppError("Guest already checked in", 409);

    return prisma.guest.update({
      where: { id: guestId },
      data: {
        checkinStatus: "arrived",
        checkedInAt: new Date(),
        checkinSource: source,
      }
    });
  }
}
