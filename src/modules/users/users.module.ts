import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { City } from '../cities/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, City])],
})
export class UsersModule {}
