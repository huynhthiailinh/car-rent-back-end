import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 465,
  user: process.env.MAIL_USER || '',
  password: process.env.MAIL_PASSWORD || '',
  secure: process.env.MAIL_SECURE || true,
  name: process.env.MAIL_NAME || 'NestJS',
}));
