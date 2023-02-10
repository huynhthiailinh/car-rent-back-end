import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { GetCarByIdIncludeEnum } from '../constants/include.enum';

export class GetCarByIdQueryDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  @ApiProperty({
    required: false,
    type: 'array',
    items: { type: 'enum' },
    default: [GetCarByIdIncludeEnum.TotalReviewers],
  })
  include: GetCarByIdIncludeEnum[];
}
