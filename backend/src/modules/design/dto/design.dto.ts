import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  IsInt,
  IsUUID,
  Min,
} from 'class-validator';
import { DesignStatus, DesignSourceType, DesignAssetCategory, EventTypeKey } from '@prisma/client';

export class CreateDesignDto {
  @ApiPropertyOptional({ example: 'Flyer Anniversaire' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: DesignSourceType, default: DesignSourceType.blank })
  @IsEnum(DesignSourceType)
  @IsOptional()
  sourceType?: DesignSourceType;

  @ApiPropertyOptional({ example: 1080 })
  @IsInt()
  @Min(1)
  @IsOptional()
  canvasWidth?: number;

  @ApiPropertyOptional({ example: 1440 })
  @IsInt()
  @Min(1)
  @IsOptional()
  canvasHeight?: number;

  @ApiProperty({ example: { background: '#ffffff', elements: [] } })
  @IsObject()
  @IsNotEmpty()
  layersData: any;

  @ApiPropertyOptional({ example: ['#ffffff', '#000000'] })
  @IsObject()
  @IsOptional()
  colorPalette?: any;

  @ApiPropertyOptional({ description: 'ID de l asset image de fond' })
  @IsUUID()
  @IsOptional()
  backgroundAssetId?: string;

  @ApiPropertyOptional({ description: 'ID du template de base' })
  @IsUUID()
  @IsOptional()
  baseTemplateId?: string;

  @ApiPropertyOptional({ example: 'Un design futuriste cyberpunk' })
  @IsString()
  @IsOptional()
  aiPrompt?: string;
}

export class UpdateDesignDto {
  @ApiPropertyOptional({ example: 'Flyer Événement Modifié' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 1080 })
  @IsInt()
  @Min(1)
  @IsOptional()
  canvasWidth?: number;

  @ApiPropertyOptional({ example: 1440 })
  @IsInt()
  @Min(1)
  @IsOptional()
  canvasHeight?: number;

  @ApiPropertyOptional({ example: { background: '#ffffff', elements: [] } })
  @IsObject()
  @IsOptional()
  layersData?: any;

  @ApiPropertyOptional({ example: ['#ffffff', '#000000'] })
  @IsObject()
  @IsOptional()
  colorPalette?: any;

  @ApiPropertyOptional({ description: 'ID de l asset image de fond' })
  @IsUUID()
  @IsOptional()
  backgroundAssetId?: string;

  @ApiPropertyOptional({ enum: DesignStatus })
  @IsEnum(DesignStatus)
  @IsOptional()
  status?: DesignStatus;

  @ApiPropertyOptional({ description: 'ID du template de base' })
  @IsUUID()
  @IsOptional()
  baseTemplateId?: string;

  @ApiPropertyOptional({ enum: DesignSourceType })
  @IsEnum(DesignSourceType)
  @IsOptional()
  sourceType?: DesignSourceType;
}

export class CreateDesignExportDto {
  @ApiProperty({ example: 'png', description: 'Format de l export (png, jpeg, pdf)' })
  @IsString()
  @IsNotEmpty()
  format: string;

  @ApiProperty({ example: 'https://storage.smartevent.com/exports/design.png' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 1080 })
  @IsInt()
  @Min(1)
  @IsOptional()
  width?: number;

  @ApiPropertyOptional({ example: 1440 })
  @IsInt()
  @Min(1)
  @IsOptional()
  height?: number;
}
