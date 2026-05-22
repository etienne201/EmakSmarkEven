import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateEventConfigDto {
  @ApiProperty({ example: { primaryColor: '#FF0000', allowSharing: true } })
  @IsObject()
  @IsNotEmpty()
  config: any;
}
