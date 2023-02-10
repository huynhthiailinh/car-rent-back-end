import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { RequestLoggerGuard } from '../../common/guards/request-logger.guard';
import { ResponseLoggerInterceptor } from '../../common/interceptors/response-logger.interceptor';
import { LoggerOption, LoggerType } from './logger-type';
import { LoggerService } from './services/logger.service';
import * as winston from 'winston';
import { LoggerPrintf } from './logger-printf';
const { combine, timestamp, printf } = winston.format;

const filterRequest = winston.format((info, opts) => {
  return info.message === LoggerType.REQUEST ? info : false;
});

const filterResponse = winston.format((info, opts) => {
  return info.message === LoggerType.RESPONSE ? info : false;
});

const filterError = winston.format((info, opts) => {
  return info.message === LoggerType.ERROR ? info : false;
});

@Module({})
export class LoggerModule {
  static register(options: LoggerOption): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        WinstonModule.forRoot({
          format: combine(
            timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
          ),
          transports: [
            new DailyRotateFile({
              filename: options.requestFileName,
              datePattern: options.datePattern,
              maxFiles: options.maxFiles,
              format: combine(
                filterRequest(),
                printf(LoggerPrintf.printRequest),
              ),
            }),
            new DailyRotateFile({
              filename: options.responseFileName,
              datePattern: options.datePattern,
              maxFiles: options.maxFiles,
              format: combine(
                filterResponse(),
                printf(LoggerPrintf.printResponse),
              ),
            }),
            new DailyRotateFile({
              filename: options.errorFileName,
              datePattern: options.datePattern,
              maxFiles: options.maxFiles,
              format: combine(filterError(), printf(LoggerPrintf.printError)),
            }),
          ],
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: RequestLoggerGuard,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ResponseLoggerInterceptor,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
