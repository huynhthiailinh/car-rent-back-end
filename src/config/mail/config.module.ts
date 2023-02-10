import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MailConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MAIL_HOST: Joi.string().required().default('smtp.gmail.com'),
        MAIL_PORT: Joi.number().required().default(465),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_SECURE: Joi.boolean().required().default(true),
        MAIL_NAME: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, MailConfigService],
  exports: [ConfigService, MailConfigService],
})
export class MailConfigModule {}
