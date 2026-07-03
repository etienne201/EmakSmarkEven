import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export enum AccountType {
  ENTREPRISE = 'entreprise',
  PERSONNEL = 'personnel'
}

export class CreateAdminDto {
  @ApiProperty({ example: 'entreprise', enum: AccountType, required: false })
  @IsEnum(AccountType)
  @IsOptional()
  accountType?: AccountType;

  // Fields for new flow
  @ApiProperty({ example: 'My Company', required: false })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({ example: 'Organisatrice', required: false })
  @IsString()
  @IsOptional()
  roleOccupied?: string;

  // Fields for old flow / fallback
  @ApiProperty({ example: 'admin@neworg.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsString()
  @IsOptional()
  passwordHash?: string;

  @ApiProperty({ example: 'Jane Organizer', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: 'My New Agency', required: false })
  @IsString()
  @IsOptional()
  organizationName?: string;

  @ApiProperty({ example: 'my-new-agency', required: false })
  @IsString()
  @IsOptional()
  organizationSlug?: string;

  @ApiProperty({ example: 'owner', required: false })
  @IsString()
  @IsOptional()
  role?: string;
}
