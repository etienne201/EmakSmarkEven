import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateSponsorDto {
  @ApiProperty({ example: 'Global Tech Corp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'Gold' })
  @IsString()
  @IsOptional()
  tier?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;
}

export class UpdateSponsorDto extends PartialType(CreateSponsorDto) {}
