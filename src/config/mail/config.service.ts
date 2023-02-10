import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get('mail.host');
  }

  get port(): number {
    return this.configService.get('mail.port');
  }

  get user(): string {
    return this.configService.get('mail.user');
  }

  get password(): string {
    return this.configService.get('mail.password');
  }

  get secure(): boolean {
    return this.configService.get('mail.secure');
  }

  get name(): string {
    return this.configService.get('mail.name');
  }
}
