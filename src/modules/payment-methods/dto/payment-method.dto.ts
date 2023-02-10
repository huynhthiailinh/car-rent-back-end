import { Exclude, Expose, Transform } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class PaymentMethodDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'name', null))
  readonly name: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'code', null))
  readonly code: string;
}
