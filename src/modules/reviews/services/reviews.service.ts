import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PAGINATE_LIMIT_DEFAULT,
  PAGINATE_OFFSET_DEFAULT,
} from '@common/constants/pagination';
import { ImageTypeEnum } from '@modules/images/constants/image-type.enum';
import { Repository } from 'typeorm';
import { GetReviewsFilterDto } from '../dto/get-reviews-filter.dto';
import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewsRepository: Repository<Review>,
  ) {}

  async getReviews(filterDto: GetReviewsFilterDto) {
    const { car_id, limit, offset } = filterDto;

    const query = this.reviewsRepository
      .createQueryBuilder('reviews')
      .leftJoinAndSelect('reviews.orderDetail', 'orderDetail')
      .leftJoinAndSelect('orderDetail.order', 'order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect(
        'user.images',
        'userImages',
        'userImages.objectType = :objectType',
        { objectType: ImageTypeEnum.Avatar },
      );

    if (car_id) query.where('reviews.car_id = :car_id', { car_id });

    query
      .limit(limit || PAGINATE_LIMIT_DEFAULT)
      .offset(offset || PAGINATE_OFFSET_DEFAULT);

    return {
      items: await query.getMany(),
      pagination: {
        total: await query.getCount(),
        limit: limit || PAGINATE_LIMIT_DEFAULT,
        offset: offset || PAGINATE_OFFSET_DEFAULT,
      },
    };
  }
}
