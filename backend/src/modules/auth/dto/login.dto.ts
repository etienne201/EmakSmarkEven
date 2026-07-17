import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'UserEven',
    description: 'Email ou identifiant organisateur (ex. UserEven, usereven@smartevent.com)',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'User123@' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}