import { Exclude, Expose, Transform } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class ReviewDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'id', null))
  readonly id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'orderDetail.order.user.id', null))
  readonly user_id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'orderDetail.order.user.fullName', null))
  readonly user_name: string;

  @Expose()
  @Transform(({ obj }) =>
    _.get(obj, 'orderDetail.order.user.images.0.url', null),
  )
  readonly avatar_url: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'orderDetail.order.user.occupation', null))
  readonly user_occupation: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'content', null))
  readonly content: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'rating', null))
  readonly rating: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'createdAt', null))
  readonly created_at: Date;
}
