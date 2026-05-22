import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@neworg.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  passwordHash: string;

  @ApiProperty({ example: 'Jane Organizer' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'My New Agency' })
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({ example: 'my-new-agency' })
  @IsString()
  @IsNotEmpty()
  organizationSlug: string;
}
