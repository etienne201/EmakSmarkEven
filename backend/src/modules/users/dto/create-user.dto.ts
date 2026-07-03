import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'UUID-OF-ROLE' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({ required: false, example: 'UUID-OF-ORG' })
  @IsUUID()
  @IsOptional()
  organizationId?: string;

  @ApiProperty({ required: false, example: 'Organisateur' })
  @IsString()
  @IsOptional()
  roleOccupied?: string;

  @ApiProperty({ required: false, enum: UserStatus, default: UserStatus.active })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ required: false, example: '00000000-0000-0000-0000-000000000000' })
  @IsUUID()
  @IsOptional()
  eventId?: string;
}
