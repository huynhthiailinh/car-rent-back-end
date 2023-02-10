import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CarTypeDto } from './car-type.dto';
import * as _ from 'lodash';

@Exclude()
export class CarDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'id', null))
  readonly id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'languages.0.name', null))
  readonly name: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'gasoline', null))
  readonly gasoline: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'languages.0.steering', null))
  readonly steering: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'capacity', null))
  readonly capacity: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'newPrice', null))
  readonly new_price: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'oldPrice', null))
  readonly old_price: number;

  @Expose()
  @Type(() => CarTypeDto)
  readonly types: CarTypeDto[];

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'images.0.url', null))
  readonly thumbnail_url: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'favourite_status', false))
  readonly favourite_status: boolean;
}
