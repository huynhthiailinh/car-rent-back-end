import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromosController } from './controllers/promos.controller';
import { Promo } from './entities/promo.entity';
import { PromosService } from './services/promos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Promo])],
  providers: [PromosService],
  controllers: [PromosController],
})
export class PromosModule {}
