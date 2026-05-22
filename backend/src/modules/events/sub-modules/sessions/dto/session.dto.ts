import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: 'Introduction to Smart Events' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiProperty({ example: '2026-06-20T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startAt: string;

  @ApiProperty({ example: '2026-06-20T11:30:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endAt: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  capacity?: number;
}

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}
