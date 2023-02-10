import { VersioningType } from '@nestjs/common/enums';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { ApplicationExceptionFilter } from './common/exceptions/application-exception.filter';
import { InternalExceptionFilter } from './common/exceptions/internal-exception.fiter';
import { ValidationExceptionFilter } from './common/exceptions/validation-exception.fiter';
import { LoggerService } from '@shared/logger/services/logger.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppConfigService } from '@config/app/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig: AppConfigService = configService.get('app');

  // Global
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(
    new InternalExceptionFilter(
      new LoggerService(app.get(WINSTON_MODULE_NEST_PROVIDER)),
    ),
  );
  app.useGlobalFilters(
    new ApplicationExceptionFilter(
      new LoggerService(app.get(WINSTON_MODULE_NEST_PROVIDER)),
    ),
  );
  app.useGlobalFilters(
    new ValidationExceptionFilter(
      new LoggerService(app.get(WINSTON_MODULE_NEST_PROVIDER)),
    ),
  );

  // Versioning
  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    })
    .setGlobalPrefix(appConfig.apiPrefix);

  // OpenAPI
  const documentConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refreshToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('/api', app, document);

  await app.listen(appConfig.port);
}
bootstrap();
