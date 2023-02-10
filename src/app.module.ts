import { BullModule } from '@nestjs/bull';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import * as redisStore from 'cache-manager-redis-store';
import { LoggerModule } from '@shared/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '@modules/auth/auth.module';
import { CarTypesModule } from '@modules/car-types/car-type.module';
import { CarsModule } from '@modules/cars/cars.module';
import { CitiesModule } from '@modules/cities/cities.module';
import { FavouritesModule } from '@modules/favourites/favourites.module';
import { ImagesModule } from '@modules/images/images.module';
import { LanguagesModule } from '@modules/languages/language.module';
import { MailModule } from '@shared/mail/mail.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { PaymentMethodsModule } from '@modules/payment-methods/payment-methods.module';
import { PromosModule } from '@modules/promos/promos.module';
import { ReviewsModule } from '@modules/reviews/reviews.module';
import { UsersModule } from '@modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { CreateRequestId } from '@common/guards/create-request-id.guard';
import { AppConfigModule } from '@config/app/config.module';
import { MysqlConfigModule } from '@config/database/mysql/config.module';
import { AppConfigService } from '@config/app/config.service';
import { CacheConfigService } from '@config/cache/config.service';
import { CacheConfigModule } from '@config/cache/config.module';
import { QueueConfigService } from '@config/queue/config.service';
import { QueueConfigModule } from '@config/queue/config.module';
import { typeOrmAsyncConfig } from '@config/database/mysql/typeorm.config';

@Module({
  imports: [
    AppConfigModule,
    MysqlConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    I18nModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
        fallbackLanguage: appConfig.fallbackLanguage,
        fallbacks: {
          'en-*': 'en',
        },
        loaderOptions: {
          path: join(__dirname, './i18n/'),
          watch: true,
        },
        typesOutputPath: join(__dirname, './i18n/types/i18n.generated.ts'),
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    BullModule.forRootAsync({
      imports: [QueueConfigModule],
      inject: [QueueConfigService],
      useFactory: async (queueConfig: QueueConfigService) => ({
        redis: {
          host: queueConfig.host,
          port: queueConfig.port,
        },
        prefix: queueConfig.prefix,
      }),
    }),
    CacheModule.registerAsync({
      imports: [CacheConfigModule],
      inject: [CacheConfigService],
      isGlobal: true,
      useFactory: (cacheConfig: CacheConfigService) => ({
        ttl: cacheConfig.ttl,
        max: cacheConfig.max,
        store: redisStore,
        host: cacheConfig.host,
        port: cacheConfig.port,
        prefix: cacheConfig.prefix,
      }),
    }),
    LoggerModule.register({
      logLevel: process.env.LOG_LEVEL || 'info',
      requestFileName: 'logs/request/%DATE%.log',
      responseFileName: 'logs/response/%DATE%.log',
      errorFileName: 'logs/error/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: 1000000,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    CarTypesModule,
    CarsModule,
    CitiesModule,
    FavouritesModule,
    ImagesModule,
    LanguagesModule,
    OrdersModule,
    PaymentMethodsModule,
    PromosModule,
    ReviewsModule,
    UsersModule,
    LoggerModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CreateRequestId,
    },
  ],
})
export class AppModule {}
