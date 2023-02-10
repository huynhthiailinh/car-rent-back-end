import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.APP_PORT || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
}));
