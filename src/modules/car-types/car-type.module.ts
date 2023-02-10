import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../cars/entities/car.entity';
import { CarsService } from '../cars/services/cars.service';
import { Favourite } from '../favourites/entities/favourite.entity';
import { Order } from '../orders/entities/order.entity';
import { Review } from '../reviews/entities/review.entity';
import { CarTypesController } from './controllers/car-types.controller';
import { CarTypeLanguage } from './entities/car-type-language.entity';
import { CarType } from './entities/car-type.entity';
import { CarTypesService } from './services/car-types.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarTypeLanguage,
      CarType,
      Car,
      Review,
      Order,
      Favourite,
    ]),
  ],
  controllers: [CarTypesController],
  providers: [CarTypesService, CarsService],
})
export class CarTypesModule {}
