import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
  host: process.env.REDIS_QUEUE_HOST || 'localhost',
  port: process.env.REDIS_QUEUE_PORT || 6379,
  prefix: process.env.REDIS_QUEUE_PREFIX || 'queue:',
}));
