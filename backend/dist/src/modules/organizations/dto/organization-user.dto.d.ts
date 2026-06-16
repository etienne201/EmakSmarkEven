import { UserStatus } from '@prisma/client';
export declare class AddOrganizationUserDto {
    email: string;
    fullName: string;
    roleId: string;
    status?: UserStatus;
}
declare const UpdateOrganizationUserDto_base: import("node_modules/@nestjs/common").Type<Partial<AddOrganizationUserDto>>;
export declare class UpdateOrganizationUserDto extends UpdateOrganizationUserDto_base {
}
export {};
