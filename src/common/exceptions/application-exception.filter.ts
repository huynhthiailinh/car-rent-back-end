import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Response } from 'express';
import {
  ApplicationError,
  ChildError,
} from 'src/common/errors/application.error';
import { LoggerService } from '@shared/logger/services/logger.service';

@Catch(ApplicationError)
export class ApplicationExceptionFilter implements ExceptionFilter {
  constructor(private loggerService: LoggerService) {}

  catch(exception: ApplicationError, host: ArgumentsHost) {
    const i18n = I18nContext.current(host);
    const response = host.switchToHttp().getResponse<Response>();
    const mainErrorKey = exception.mainErrorKey;
    const status = Number(i18n.t(`${mainErrorKey}.http_code`));
    const childErrors = exception.childErrors;
    const body = {
      error: {
        error_id: `${mainErrorKey.split('.')[1]}`,
        code: i18n.t(`${mainErrorKey}.app_code`),
        title: i18n.t(`${mainErrorKey}.title`),
        message: `${i18n.t(`${mainErrorKey}.prod`)} (${
          mainErrorKey.split('.')[1]
        })`,
        errors: this.printChildErrors(childErrors, i18n),
      },
    };
    this.loggerService.logError(host, status, body, exception);

    response.status(status).json(body);
  }

  protected printChildErrors(errors: ChildError[], i18n: I18nContext) {
    const result = [];

    if (errors) {
      for (const error of errors) {
        result.push({
          error_id: `${error.key.split('.')[1]}`,
          field: error.field,
          title: i18n.t(`${error.key}.title`),
          message: `${i18n.t(`${error.key}.prod`)} (${
            error.key.split('.')[1]
          })`,
        });
      }
    }
    return result;
  }
}
