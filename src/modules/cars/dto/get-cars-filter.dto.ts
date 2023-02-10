import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PaginateDto } from 'src/common/request/paginate.dto';
import { CarListTypeEnum } from '../constants/car-list-type.enum';

export class GetCarsFilterDto extends PaginateDto {
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
  @ApiProperty({
    required: false,
    type: 'enum',
    enum: CarListTypeEnum,
  })
  order_by: CarListTypeEnum;

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
}
