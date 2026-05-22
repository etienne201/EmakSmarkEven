import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateFormDto {
  @ApiProperty({ example: 'Feedback Form' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: [{ label: 'How was the event?', type: 'select', options: ['Great', 'Good', 'Average'] }] })
  @IsArray()
  @IsNotEmpty()
  fields: any[];
}

export class UpdateFormDto extends PartialType(CreateFormDto) {}

export class FormResponseDto {
  @ApiProperty({ example: { 'q1': 'Great' } })
  @IsNotEmpty()
  answers: any;
}
