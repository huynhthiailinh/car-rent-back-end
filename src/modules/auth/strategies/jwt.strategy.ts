import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApplicationError } from '@common/errors/application.error';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../entities/token.entity';
import { TokenError, UserError } from '@common/constants/error-message';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Token) private tokensRepository: Repository<Token>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub, tokenId } = payload;
    const user: User = await this.usersRepository.findOne({
      where: { id: sub },
      select: [
        'id',
        'email',
        'fullName',
        'phoneNumber',
        'address',
        'cityId',
        'occupation',
      ],
    });

    if (!user) {
      throw new ApplicationError(UserError.USER_NOT_FOUND);
    }

    const token: Token = await this.tokensRepository.findOne({
      where: { id: tokenId },
    });

    if (!token) {
      throw new ApplicationError(TokenError.TOKEN_NOT_FOUND);
    }

    if (token.expiredAt < new Date()) {
      throw new ApplicationError(TokenError.TOKEN_EXPIRED);
    }

    return user;
  }
}
