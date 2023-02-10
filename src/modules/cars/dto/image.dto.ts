import { Exclude, Expose, Transform } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class ImageDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'id', null))
  id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'url', null))
  url: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'objectType', null))
  type: string;
}
