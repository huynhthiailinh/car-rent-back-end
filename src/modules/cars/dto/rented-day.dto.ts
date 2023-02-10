import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RentedDayDto {
  @Expose()
  readonly start_at: Date;

  @Expose()
  readonly end_at: Date;
}
