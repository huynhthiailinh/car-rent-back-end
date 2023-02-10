import { Exclude, Expose, Transform } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class CarTypeDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'id', null))
  readonly id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'languages.0.name', null))
  readonly name: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'count', null))
  readonly count: number;
}
