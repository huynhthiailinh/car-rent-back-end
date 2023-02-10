import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.AUTH_JWT_SECRET || 'secret',
  accessTokenExpiresIn: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN || '30',
}));
