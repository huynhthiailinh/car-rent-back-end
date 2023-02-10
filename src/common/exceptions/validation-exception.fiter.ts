import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { I18nContext, I18nValidationException } from 'nestjs-i18n';
import { Response } from 'express';
import { ValidationError } from 'class-validator';
import { LoggerService } from '@shared/logger/services/logger.service';

@Catch(I18nValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private loggerService: LoggerService) {}

  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current(host);
    const response = host.switchToHttp().getResponse<Response>();
    const status = Number(exception.getStatus());
    const errors = exception.errors;
    const errorKey = 'system.CUS-0603';
    const body = {
      error: {
        error_id: `${errorKey.split('.')[1]}`,
        code: i18n.t(`${errorKey}.app_code`),
        title: i18n.t(`${errorKey}.title`),
        message: `${i18n.t(`${errorKey}.prod`)} (${errorKey.split('.')[1]})`,
        errors: this.flattenValidationErrors(errors, i18n),
      },
    };
    this.loggerService.logError(host, status, body, exception);

    response.status(status).json(body);
  }

  protected flattenValidationErrors(
    validationErrors: ValidationError[],
    i18n: I18nContext,
  ) {
    const result = [];

    if (validationErrors) {
      for (const error of validationErrors) {
        for (const key in error.constraints) {
          result.push({
            error_id: `${error.constraints[key].split('.')[1]}`,
            field: error.property,
            title: i18n.t(`${error.constraints[key]}.title`),
            message: `${i18n.t(`${error.constraints[key]}.prod`)} (${
              error.constraints[key].split('.')[1]
            })`,
          });
        }
        if (error.children && error.children.length) {
          result.push(...this.flattenValidationErrors(error.children, i18n));
        }
      }
    }

    return result;
  }
}
