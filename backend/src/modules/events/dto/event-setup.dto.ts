import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDateString,
  Matches,
  MinLength,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventTypeKey, VisibilityType } from '@prisma/client';

// ======================================================
// ÉTAPE 1 — Informations générales (obligatoire)
// ======================================================
export class SetupStep1Dto {
  @ApiProperty({ example: 'Mariage Awa & Karim' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'mariage-awa-karim' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Le slug doit être en minuscules, sans espaces (lettres, chiffres et tirets uniquement).',
  })
  slug: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({ enum: EventTypeKey, example: 'wedding' })
  @IsEnum(EventTypeKey)
  eventType: EventTypeKey;

  @ApiPropertyOptional({ default: 'fr' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  language?: string;

  @ApiPropertyOptional({ enum: VisibilityType, default: VisibilityType.private })
  @IsEnum(VisibilityType)
  @IsOptional()
  visibility?: VisibilityType;
}

// ======================================================
// ÉTAPE 2 — Lieu & dates (obligatoire, validation croisée)
// ======================================================
export class SetupStep2Dto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'Europe/Paris' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  timezone?: string;

  @ApiProperty({ example: '2026-05-21T10:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2026-05-22T22:00:00Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

// ======================================================
// ÉTAPE 3 — Modules & fonctionnalités (optionnel)
// Contraintes: guests toujours actif ; qrCheckin & tables dépendent de guests
// ======================================================
export class SetupModulesDto {
  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  guests?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  invitations?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  qrCheckin?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  tables?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  seating?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  analytics?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  badges?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  notifications?: boolean;
}

export class SetupStep3Dto {
  @ApiProperty({ type: SetupModulesDto })
  @IsObject()
  @ValidateNested()
  @Type(() => SetupModulesDto)
  modules: SetupModulesDto;
}

// ======================================================
// ÉTAPE 4 — Design & branding (optionnel)
// ======================================================
export class SetupStep4Dto {
  @ApiPropertyOptional({ example: 'elegant-gold' })
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiPropertyOptional({ description: 'Tokens de couleurs (clé → hex)' })
  @IsObject()
  @IsOptional()
  colors?: Record<string, string>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiPropertyOptional({ description: 'Réglages typographiques' })
  @IsObject()
  @IsOptional()
  typography?: Record<string, unknown>;
}

// ======================================================
// ÉTAPE 5 — Invités & accès (optionnel)
// ======================================================
export class SetupStep5Dto {
  @ApiPropertyOptional({ type: [String], example: ['Famille', 'Amis', 'VIP'] })
  @IsOptional()
  guestCategories?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Accueil', 'Sécurité'] })
  @IsOptional()
  staffCategories?: string[];

  @ApiPropertyOptional({ description: 'Permissions personnalisées par catégorie' })
  @IsObject()
  @IsOptional()
  permissions?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Accès personnalisés' })
  @IsObject()
  @IsOptional()
  customAccess?: Record<string, unknown>;
}

// ======================================================
// Réglages & modules (endpoints dédiés settings / modules)
// ======================================================
export class UpdateEventSettingsDto {
  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  rsvpEnabled?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  qrEnabled?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  checkinEnabled?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  networkingEnabled?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  livestreamEnabled?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  guestLimit?: number;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  customRules?: Record<string, unknown>;
}

export class UpdateEventModulesDto {
  @ApiProperty({ type: SetupModulesDto })
  @IsObject()
  @ValidateNested()
  @Type(() => SetupModulesDto)
  modules: SetupModulesDto;
}

/** Mapping étape → DTO, utilisé par le service pour la validation dynamique. */
export const SETUP_STEP_DTOS = {
  1: SetupStep1Dto,
  2: SetupStep2Dto,
  3: SetupStep3Dto,
  4: SetupStep4Dto,
  5: SetupStep5Dto,
} as const;

export type SetupStepNumber = keyof typeof SETUP_STEP_DTOS;
