import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginateDto {
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, type: 'number' })
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, type: 'number' })
  offset: number;
}
