import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }

  get apiPrefix(): string {
    return this.configService.get<string>('app.apiPrefix');
  }

  get fallbackLanguage(): string {
    return this.configService.get<string>('app.fallbackLanguage');
  }
}
