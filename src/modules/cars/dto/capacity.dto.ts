import { Exclude, Expose, Transform, Type } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class CapacityDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'capacity', null))
  readonly capacity: number;

  @Expose()
  @Type(() => Number)
  @Transform(({ obj }) => _.toNumber(_.get(obj, 'count', null)))
  readonly count: number;
}
