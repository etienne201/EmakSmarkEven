import { prisma } from "../prisma";
import { AppError } from "@backend/middleware/error-handler";

export class CheckinService {
  static async checkIn(ownerId: string, guestId: string, status: string = "arrived") {
    // Note: status is ignored for now as we use the enum 'arrived'
    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        event: { adminId: ownerId }
      }
    });
    
    if (!guest) throw new AppError("Guest not found", 404);
    
    return prisma.guest.update({
      where: { id: guestId },
      data: {
        checkinStatus: 'arrived',
        checkedInAt: new Date()
      }
    });
  }

  static async cancelCheckIn(ownerId: string, guestId: string) {
    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        event: { adminId: ownerId }
      }
    });
    
    if (!guest) throw new AppError("Check-in not found", 404);
    
    return prisma.guest.update({
      where: { id: guestId },
      data: {
        checkinStatus: 'not_arrived',
        checkedInAt: null
      }
    });
  }

  static async getAttendance(ownerId: string) {
    return prisma.guest.findMany({
      where: {
        event: { adminId: ownerId },
        checkinStatus: 'arrived'
      },
      include: {
        table: true
      },
      orderBy: { checkedInAt: 'desc' }
    });
  }
}

