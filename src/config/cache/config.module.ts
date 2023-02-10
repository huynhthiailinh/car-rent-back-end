import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { CacheConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        REDIS_CACHE_HOST: Joi.string().required().default('localhost'),
        REDIS_CACHE_PORT: Joi.number().default(6379).required(),
        REDIS_CACHE_PREFIX: Joi.string().required().default('cache:'),
        REDIS_CACHE_TTL: Joi.number().default(60).required(),
        REDIS_CACHE_MAX: Joi.number().default(100).required(),
      }),
    }),
  ],
  providers: [ConfigService, CacheConfigService],
  exports: [ConfigService, CacheConfigService],
})
export class CacheConfigModule {}
