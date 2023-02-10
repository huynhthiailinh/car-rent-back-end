import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { Token } from './entities/token.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConfigModule } from '@config/auth/jwt/config.module';
import { JwtConfigService } from '@config/auth/jwt/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User]),
    JwtConfigModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      inject: [JwtConfigService],
      useFactory: async (jwtConfig: JwtConfigService) => ({
        secret: jwtConfig.secret,
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
