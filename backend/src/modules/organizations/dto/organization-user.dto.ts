import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class AddOrganizationUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'UUID-OF-ROLE' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({ required: false, enum: UserStatus, default: UserStatus.active })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}

export class UpdateOrganizationUserDto extends PartialType(AddOrganizationUserDto) {}
