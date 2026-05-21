import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: 'SITE_NAME' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Emak Smart Even' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
