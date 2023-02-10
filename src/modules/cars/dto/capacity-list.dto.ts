import { Exclude, Expose, Type } from 'class-transformer';
import { CapacityDto } from './capacity.dto';

@Exclude()
export class CapacityListDto {
  @Expose()
  @Type(() => CapacityDto)
  readonly items: CapacityDto[];
}
