import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/common/cache';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Serialize } from '@common/interceptors/serialize.interceptor';
import { GetReviewsFilterDto } from '../dto/get-reviews-filter.dto';
import { ReviewsDto } from '../dto/reviews.dto';
import { ReviewsService } from '../services/reviews.service';

@ApiTags('Reviews')
@Controller({
  version: '1',
  path: 'reviews',
})
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Serialize(ReviewsDto)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get reviews' })
  @Get()
  async getReviews(@Query() filterDto: GetReviewsFilterDto) {
    return await this.reviewsService.getReviews(filterDto);
  }
}
