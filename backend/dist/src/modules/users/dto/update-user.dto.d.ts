import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("node_modules/@nestjs/common").Type<Partial<Omit<CreateUserDto, "password">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
