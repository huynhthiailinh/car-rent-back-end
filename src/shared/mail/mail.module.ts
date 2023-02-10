import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './processors/mail.processor';
import { MailService } from './services/mail.service';
import { MailConfigService } from '@config/mail/config.service';
import { MailConfigModule } from '@config/mail/config.module';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [MailConfigModule, MailConfigModule],
      inject: [MailConfigService],
      useFactory: (mailConfig: MailConfigService) => ({
        transport: {
          host: mailConfig.host,
          port: mailConfig.port,
          secure: mailConfig.secure,
          auth: {
            user: mailConfig.user,
            pass: mailConfig.password,
          },
        },
        defaults: {
          from: `"${mailConfig.name}" <${mailConfig.user}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [MailProcessor, MailService, MailConfigService],
  exports: [MailService],
})
export class MailModule {}
