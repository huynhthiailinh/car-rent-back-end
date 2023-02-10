import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seeder } from './seeder';
import { UserSeederModule } from './user/user.module';
import { typeOrmAsyncConfig } from '@config/database/mysql/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmAsyncConfig), UserSeederModule],
  providers: [Seeder],
})
export class SeederModule {}
