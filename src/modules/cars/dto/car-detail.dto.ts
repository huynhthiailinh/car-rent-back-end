import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CarTypeDto } from './car-type.dto';
import { ImageDto } from './image.dto';
import * as _ from 'lodash';

@Exclude()
export class CarDetailDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'id', null))
  readonly id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'languages.0.name', null))
  readonly name: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'capacity', null))
  readonly capacity: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'languages.0.description', null))
  readonly description: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'gasoline', null))
  readonly gasoline: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'languages.0.steering', null))
  readonly steering: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'newPrice', null))
  readonly newPrice: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'oldPrice', null))
  readonly oldPrice: number;

  @Expose()
  @Type(() => CarTypeDto)
  readonly types: CarTypeDto[];

  @Expose()
  @Type(() => ImageDto)
  readonly images: ImageDto[];

  @Expose()
  @Transform(({ obj }) => _.toNumber(_.get(obj, 'averageRating', null)))
  readonly average_rating: number;

  @Expose()
  @Transform(({ obj }) =>
    _.toNumber(_.get(obj, 'total_reviewers.result', null)),
  )
  readonly total_reviewers: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'favourite_status', false))
  readonly favourite_status: boolean;
}
