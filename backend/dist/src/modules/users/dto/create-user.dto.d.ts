import { UserStatus } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    fullName: string;
    password: string;
    roleId: string;
    organizationId?: string;
    status?: UserStatus;
}
