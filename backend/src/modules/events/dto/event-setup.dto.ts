import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class EventSetupStepDto {
  @ApiProperty({ example: { name: 'Step Data', value: '...' } })
  @IsObject()
  @IsNotEmpty()
  metadata: any;
}

export class UpdateEventSettingsDto {
  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  rsvpEnabled?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  qrEnabled?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  checkinEnabled?: boolean;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  guestLimit?: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  customRules?: any;
}

export class UpdateEventModulesDto {
  @ApiProperty({ example: ['ticketing', 'networking', 'surveys'] })
  @IsNotEmpty()
  modules: string[];
}
