import { GuestRole, GuestStatus } from '@prisma/client';
export declare class CreateGuestDto {
    fullName: string;
    email?: string;
    phone?: string;
    guestRole?: GuestRole;
    status?: GuestStatus;
}
