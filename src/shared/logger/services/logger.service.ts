import {
  ArgumentsHost,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerType } from '../logger-type';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  logRequest(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();

      const cloneHeaders = JSON.parse(JSON.stringify(request.headers));

      if (cloneHeaders?.authorization) {
        cloneHeaders.authorization = '******';
      }

      const cloneBody = JSON.parse(JSON.stringify(request.body));

      if (cloneBody?.password) {
        cloneBody.password = '******';
      }

      this.logger.log(LoggerType.REQUEST, {
        id: request.id,
        method: request.method,
        url: request.originalUrl,
        userId: request?.user?.id?.toString(),
        headers: cloneHeaders,
        body: cloneBody,
      });
    } catch (error) {}
  }

  logResponse(context: ExecutionContext, status: number, body: object) {
    try {
      const request = context.switchToHttp().getRequest();

      const cloneHeaders = JSON.parse(JSON.stringify(request.headers));

      if (cloneHeaders?.authorization) {
        cloneHeaders.authorization = '******';
      }

      const cloneBody = JSON.parse(JSON.stringify(body));

      if (cloneBody?.data?.access_token) {
        cloneBody.data.access_token = '******';
      }

      this.logger.log(LoggerType.RESPONSE, {
        id: request.id,
        method: request.method,
        url: request.originalUrl,
        userId: request?.user?.id,
        status,
        headers: cloneHeaders,
        body: request.method == 'GET' ? null : cloneBody,
      });
    } catch (error) {}
  }

  logError(
    context: ArgumentsHost,
    status: number,
    body: object,
    exception: Error,
  ) {
    try {
      const request = context.switchToHttp().getRequest();

      const cloneHeaders = JSON.parse(JSON.stringify(request.headers));

      if (cloneHeaders?.authorization) {
        cloneHeaders.authorization = '******';
      }

      this.logger.error(LoggerType.ERROR, {
        id: request.id,
        method: request.method,
        url: request.originalUrl,
        userId: request?.user?.id?.toString(),
        status,
        headers: cloneHeaders,
        body,
        exception,
      });
    } catch (error) {}
  }
}
