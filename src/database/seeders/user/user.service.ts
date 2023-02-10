import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Repository } from 'typeorm';
import { users } from './data';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create(): Array<Promise<User>> {
    return users.map(async (user: IUser) => {
      return await this.usersRepository
        .findOne({ where: { email: user.email } })
        .then(async (dbUser) => {
          if (dbUser) {
            return Promise.resolve(null);
          }

          return Promise.resolve(await this.usersRepository.save(user));
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
