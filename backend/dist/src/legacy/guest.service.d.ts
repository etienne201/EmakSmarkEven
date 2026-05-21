import { GuestRole } from '@prisma/client';
export declare class GuestService {
    static listGuests(eventId: string): Promise<any>;
    static addGuest(eventId: string, data: {
        fullName: string;
        email?: string;
        phone?: string;
        guestRole?: GuestRole;
    }): Promise<any>;
    static getGuestByTicketCode(code: string): Promise<any>;
}
