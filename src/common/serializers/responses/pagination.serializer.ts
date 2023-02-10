import { Exclude, Expose, Transform, Type } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class PaginationSerializer {
  @Expose()
  @Type(() => Number)
  @Transform(({ obj }) => _.get(obj, 'total', null))
  readonly total: number;

  @Expose()
  @Type(() => Number)
  @Transform(({ obj }) => _.get(obj, 'limit', null))
  readonly limit: number;

  @Expose()
  @Type(() => Number)
  @Transform(({ obj }) => _.get(obj, 'offset', null))
  readonly offset: number;
}
