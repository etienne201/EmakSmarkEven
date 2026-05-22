import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ example: 'Hero Banner' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'hero' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: { text: 'Welcome to the gala!', image: '...' } })
  @IsObject()
  @IsNotEmpty()
  data: any;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  order?: number;
}

export class UpdateContentDto extends PartialType(CreateContentDto) {}
