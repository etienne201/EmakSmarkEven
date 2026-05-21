import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID, IsArray } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class SendNotificationDto {
  @ApiProperty({ example: 'email', enum: NotificationType })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({ example: 'Bienvenue !' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Merci de vous être inscrit.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false, example: 'UUID-OF-USER' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false, example: 'UUID-OF-EVENT' })
  @IsUUID()
  @IsOptional()
  eventId?: string;
}

export class SendBulkNotificationDto extends SendNotificationDto {
  @ApiProperty({ example: ['UUID1', 'UUID2'] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  userIds: string[];
}
