import { Exclude, Expose, Transform } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class CityDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'id', null))
  readonly id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'name', null))
  readonly name: string;
}
