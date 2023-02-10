import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { UserSeederService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
