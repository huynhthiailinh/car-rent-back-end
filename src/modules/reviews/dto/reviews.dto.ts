import { Exclude, Expose, Type } from 'class-transformer';
import { PaginationSerializer } from '@common/serializers/responses/pagination.serializer';
import { ReviewDto } from './review.dto';

@Exclude()
export class ReviewsDto {
  @Expose()
  @Type(() => ReviewDto)
  readonly items: ReviewDto[];

  @Expose()
  @Type(() => PaginationSerializer)
  readonly pagination: PaginationSerializer;
}
