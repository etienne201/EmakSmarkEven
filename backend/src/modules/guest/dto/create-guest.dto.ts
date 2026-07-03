import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail, IsEnum, IsInt } from 'class-validator';
import { GuestRole, GuestStatus } from '@prisma/client';

export class CreateGuestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ required: false, example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, example: '+33612345678' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false, enum: GuestRole, default: GuestRole.attendee })
  @IsEnum(GuestRole)
  @IsOptional()
  guestRole?: GuestRole;

  @ApiProperty({ required: false, enum: GuestStatus, default: GuestStatus.pending })
  @IsEnum(GuestStatus)
  @IsOptional()
  status?: GuestStatus;

  @ApiProperty({ required: false, example: 'M.' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsInt()
  @IsOptional()
  table?: number;

  @ApiProperty({ required: false, example: 'Table 1' })
  @IsString()
  @IsOptional()
  tableName?: string;

  @ApiProperty({ required: false, example: 'fr' })
  @IsString()
  @IsOptional()
  lang?: string;
}

