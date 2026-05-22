import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsOptional, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ example: 'Modern Wedding' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'wedding' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'https://cdn.example.com/preview.jpg' })
  @IsUrl()
  @IsNotEmpty()
  previewUrl: string;

  @ApiProperty({ example: { colors: { primary: '#000' } } })
  @IsNotEmpty()
  config: any;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;
}

export class CreateWebhookDto {
  @ApiProperty({ example: 'https://my-service.com/webhook' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: ['event.created', 'guest.registered'] })
  @IsNotEmpty()
  events: string[];

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateApiKeyDto {
  @ApiProperty({ example: 'My App Key' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
