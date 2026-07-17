
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({example: 'superadmin@smartevent.com'})
  @IsEmail()
  email: string;
}