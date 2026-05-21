import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ example: 'Table 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}

export class UpdateTableDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
