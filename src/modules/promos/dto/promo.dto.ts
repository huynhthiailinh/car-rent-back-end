import { Exclude, Expose, Transform } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class PromoDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'id', null))
  id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'code', null))
  code: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'discount', null))
  discount: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'type', null))
  type: string;
}
