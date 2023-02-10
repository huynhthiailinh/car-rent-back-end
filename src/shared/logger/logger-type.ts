import { LogLevel } from '@nestjs/common';

export enum LoggerType {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
  ERROR = 'ERROR',
}

export type LoggerOption = {
  logLevel: string;
  requestFileName: string;
  responseFileName: string;
  errorFileName: string;
  datePattern: string;
  maxFiles: number;
};

export type LogContent = {
  level: LogLevel;
  timestamp: number;
  message: string;
  context: LogHttpContext;
  stack: [LogHttpContext];
};

export type LogHttpContext = {
  id: string;
  method: string;
  url: string;
  userId?: string;
  status?: number;
  headers: object;
  body: object;
  exception?: object;
};
