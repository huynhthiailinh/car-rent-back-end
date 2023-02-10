import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { ApplicationError } from '@common/errors/application.error';
import { Token } from '../entities/token.entity';
import { AuthTokenEnum } from '../constants/auth-token.constant';
import * as moment from 'moment';
import { RegisterDto } from '../dto/register.dto';
import { ImageTypeEnum } from '@modules/images/constants/image-type.enum';
import { Cron, CronExpression } from '@nestjs/schedule/dist';
import { LoginDto } from '../dto/login.dto';
import { SystemError, UserError } from '@common/constants/error-message';
import { JwtConfigService } from '@config/auth/jwt/config.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private jwtConfig: JwtConfigService,
    @InjectRepository(Token) private tokensRepository: Repository<Token>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const {
      email,
      password,
      full_name,
      phone_number,
      address,
      city_id,
      occupation,
    } = registerDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new ApplicationError(SystemError.INVALID_PARAMETER, [
        {
          key: UserError.EMAIL_ALREADY_EXISTS,
          field: 'email',
        },
      ]);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.usersRepository.save({
      email,
      hashedPassword: hashedPassword,
      fullName: full_name,
      phoneNumber: phone_number,
      address,
      cityId: city_id,
      occupation,
    });
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new ApplicationError(UserError.WRONG_CREDENTIALS);
    }

    const expiresIn: number = this.jwtConfig.accessTokenExpiresIn;

    const token = await this.tokensRepository.save({
      type: AuthTokenEnum.AccessToken,
      expiredAt: moment().add(expiresIn, 'minutes').format(),
      userId: user.id,
    });

    const payload: JwtPayload = { sub: user.id, tokenId: token.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async profile(user: User) {
    const query = this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: user.id })
      .leftJoinAndSelect(
        'users.images',
        'userImages',
        'userImages.objectType = :objectType',
        {
          objectType: ImageTypeEnum.Avatar,
        },
      )
      .leftJoinAndSelect('users.city', 'city');
    return await query.getOne();
  }

  async logout(user: User) {
    this.tokensRepository.softDelete({
      userId: user.id,
    });
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async removeExpiredTokens() {
    await this.tokensRepository.delete({
      expiredAt: LessThan(new Date()),
    });
  }
}
