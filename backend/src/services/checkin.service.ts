import { Storage } from "../storage/storage";
import { AppError } from "../middleware/error-handler";

export class CheckinService {
  static async checkIn(ownerId: string, guestId: string, status: string = "arrived") {
    const guests = await Storage.getGuests(ownerId);
    const idx = guests.findIndex((g: any) => g.id.toString() === guestId.toString());
    if (idx === -1) throw new AppError("Guest not found", 404);
    
    guests[idx].checkinStatus = "arrived";
    guests[idx].checkedInAt = new Date().toISOString();
    await Storage.saveGuests(guests, ownerId);

    const attendance = await Storage.getAttendance(ownerId);
    if (!attendance.some((a: any) => a.guestId.toString() === guestId.toString())) {
      attendance.push({
        guestId,
        fullName: guests[idx].fullName,
        status: "Présent",
        timestamp: new Date().toISOString()
      });
      await Storage.saveAttendance(attendance, ownerId);
    }
    
    return guests[idx];
  }

  static async cancelCheckIn(ownerId: string, guestId: string) {
    const guests = await Storage.getGuests(ownerId);
    const idx = guests.findIndex((g: any) => g.id.toString() === guestId.toString());
    if (idx === -1) throw new AppError("Check-in not found", 404);
    
    guests[idx].checkinStatus = "not_arrived";
    guests[idx].checkedInAt = null;
    await Storage.saveGuests(guests, ownerId);

    const attendance = await Storage.getAttendance(ownerId);
    const filtered = attendance.filter((a: any) => a.guestId.toString() !== guestId.toString());
    await Storage.saveAttendance(filtered, ownerId);
    
    return guests[idx];
  }

  static async getAttendance(ownerId: string) {
    const guests = await Storage.getGuests(ownerId);
    return guests.filter((g: any) => g.checkinStatus === "arrived");
  }
}
