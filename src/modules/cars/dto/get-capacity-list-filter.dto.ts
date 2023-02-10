import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { GetCapacityListIncludeEnum } from '../constants/include.enum';

export class GetCapacityListFilterDto {
  @IsOptional()
  @ApiProperty({ required: false })
  pick_up_city_id: number;

  @IsOptional()
  @ApiProperty({ required: false })
  pick_up_at: Date;

  @IsOptional()
  @ApiProperty({ required: false })
  drop_off_city_id: number;

  @IsOptional()
  @ApiProperty({ required: false })
  drop_off_at: Date;

  @IsOptional()
  @ApiProperty({ required: false })
  search: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [+value];
    }
    return value.map((v: string) => Number(v));
  })
  @ApiProperty({ required: false, type: 'array', items: { type: 'number' } })
  type: number[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [+value];
    }
    return value.map((v: string) => Number(v));
  })
  @ApiProperty({ required: false, type: 'array', items: { type: 'number' } })
  capacity: number[];

  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, type: 'number' })
  max_price: number;

  @IsOptional()
  @ApiProperty({ required: false, type: 'number', default: 8 })
  max_capacity: number;

  @IsOptional()
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
    default: [GetCapacityListIncludeEnum.CountCars],
  })
  include: GetCapacityListIncludeEnum[];
}
