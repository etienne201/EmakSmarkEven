import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateVenueDto {
  @ApiProperty({ example: 'Grand Ballroom' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  capacity?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  mapUrl?: string;
}

export class UpdateVenueDto extends PartialType(CreateVenueDto) {}
