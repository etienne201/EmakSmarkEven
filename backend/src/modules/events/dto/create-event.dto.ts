import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { EventTypeKey, VisibilityType } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({
    required: false,
    description:
      "Organisation cible. Optionnel : par défaut l'organisation de l'utilisateur authentifié (requis pour un Super Admin sans organisation).",
  })
  @IsUUID()
  @IsOptional()
  organizationId?: string;

  @ApiProperty({ example: 'My Awesome Event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'my-awesome-event' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'wedding' })
  @IsEnum(EventTypeKey)
  eventType: EventTypeKey;

  @ApiProperty({ example: '2026-05-21T10:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false, example: '2026-05-22T22:00:00Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, enum: VisibilityType, default: VisibilityType.private })
  @IsEnum(VisibilityType)
  @IsOptional()
  visibility?: VisibilityType;

  @ApiProperty({ required: false, default: 'fr' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  country?: string;
}
