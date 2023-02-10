import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  host: process.env.REDIS_CACHE_HOST || 'localhost',
  port: process.env.REDIS_CACHE_PORT || 6379,
  prefix: process.env.REDIS_CACHE_PREFIX || 'cache:',
  ttl: process.env.REDIS_CACHE_TTL || 60,
  max: process.env.REDIS_CACHE_MAX || 100,
}));
