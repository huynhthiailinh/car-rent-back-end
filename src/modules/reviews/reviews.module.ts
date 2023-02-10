import { Module } from '@nestjs/common/decorators';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './controllers/reviews.controller';
import { Review } from './entities/review.entity';
import { ReviewsService } from './services/reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
