import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouritesController } from './controllers/favourites.controller';
import { Favourite } from './entities/favourite.entity';
import { FavouritesService } from './services/favourites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favourite])],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
