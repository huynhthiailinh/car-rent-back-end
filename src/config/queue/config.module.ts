import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { QueueConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        REDIS_QUEUE_HOST: Joi.string().required().default('localhost'),
        REDIS_QUEUE_PORT: Joi.number().default(6379).required(),
        REDIS_QUEUE_PREFIX: Joi.string().required().default('queue:'),
      }),
    }),
  ],
  providers: [ConfigService, QueueConfigService],
  exports: [ConfigService, QueueConfigService],
})
export class QueueConfigModule {}
