import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get('cache.host');
  }

  get port(): number {
    return this.configService.get('cache.port');
  }

  get prefix(): string {
    return this.configService.get('cache.prefix');
  }

  get ttl(): number {
    return this.configService.get('cache.ttl');
  }

  get max(): number {
    return this.configService.get('cache.max');
  }
}
