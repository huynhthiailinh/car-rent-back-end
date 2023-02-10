import { Module } from '@nestjs/common';
import { CarsService } from './services/cars.service';
import { CarsController } from './controllers/cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Review } from '../reviews/entities/review.entity';
import { Order } from '../orders/entities/order.entity';
import { Favourite } from '../favourites/entities/favourite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, Review, Order, Favourite])],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
