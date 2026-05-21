import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateThemeDto {
  @ApiProperty({ example: 'Summer Theme' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: { primary: '#ff0000' } })
  @IsObject()
  @IsOptional()
  tokens?: any;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  canvas?: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  customCss?: string;
}
