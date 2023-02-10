import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Token } from '@modules/auth/entities/token.entity';
import { CarTypeLanguage } from '@modules/car-types/entities/car-type-language.entity';
import { CarType } from '@modules/car-types/entities/car-type.entity';
import { CarCarType } from '@modules/cars/entities/car-car-type.entity';
import { CarCity } from '@modules/cars/entities/car-city.entity';
import { CarLanguage } from '@modules/cars/entities/car-language.entity';
import { Car } from '@modules/cars/entities/car.entity';
import { City } from '@modules/cities/entities/city.entity';
import { Favourite } from '@modules/favourites/entities/favourite.entity';
import { Language } from '@modules/languages/entities/language.entity';
import { OrderDetail } from '@modules/orders/entities/order-detail.entity';
import { Order } from '@modules/orders/entities/order.entity';
import { PaymentMethod } from '@modules/payment-methods/entities/payment-method.entity';
import { Promo } from '@modules/promos/entities/promo.entity';
import { Review } from '@modules/reviews/entities/review.entity';
import { User } from '@modules/users/entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MysqlConfigModule } from './config.module';
import { MysqlConfigService } from './config.service';
import { Image } from '@modules/images/entities/image.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [MysqlConfigModule],
  inject: [MysqlConfigService],
  useFactory: async (
    mysqlConfig: MysqlConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      username: mysqlConfig.username,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      synchronize: mysqlConfig.synchronize,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [
        User,
        City,
        CarCity,
        OrderDetail,
        Car,
        CarLanguage,
        Language,
        CarTypeLanguage,
        CarType,
        CarCarType,
        Image,
        Favourite,
        Order,
        Review,
        PaymentMethod,
        Promo,
        Token,
      ],
      timezone: 'Z',
    };
  },
};
