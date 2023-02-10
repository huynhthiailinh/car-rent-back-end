import { Exclude, Expose, Type } from 'class-transformer';
import { RentedDayDto } from './rented-day.dto';

@Exclude()
export class RentedDatesDto {
  @Expose()
  @Type(() => RentedDayDto)
  readonly items: RentedDayDto[];
}
