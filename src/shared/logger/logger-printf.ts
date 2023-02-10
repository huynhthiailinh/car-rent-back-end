import { LogContent } from './logger-type';

export class LoggerPrintf {
  static printRequest(logContent: LogContent): string {
    const level = logContent.level.toUpperCase();
    const { timestamp, message, context } = logContent;
    const { id, method, url, userId } = context;
    const headers = JSON.stringify(context.headers);
    const body = JSON.stringify(context.body);

    return `${level}\t ${timestamp}\t ${message}\t ${id}\t ${method}\t ${url}\t ${userId}\t headers=${headers}\t body=${body}`;
  }

  static printResponse(logContent: LogContent) {
    const level = logContent.level.toUpperCase();
    const { timestamp, message, context } = logContent;
    const { id, method, url, userId, status } = context;
    const headers = JSON.stringify(context.headers);
    const body = JSON.stringify(context.body);

    return `${level}\t ${timestamp}\t ${message}\t ${id}\t ${method}\t ${url}\t ${userId}\t ${status}\t headers=${headers}\t body=${body}`;
  }

  static printError(logContent: LogContent) {
    const level = logContent.level.toUpperCase();
    const {
      timestamp,
      message,
      stack: [context],
    } = logContent;
    const { id, method, url, userId, status } = context;
    const headers = JSON.stringify(context.headers);
    const body = JSON.stringify(context.body);
    const exception = JSON.stringify(
      context.exception,
      Object.getOwnPropertyNames(context.exception),
    );

    return `${level}\t ${timestamp}\t ${message}\t ${id}\t ${method}\t ${url}\t ${userId}\t ${status}\t headers=${headers}\t body=${body}\t exception=${exception}`;
  }
}
