import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateFavouriteStatusDto } from '../dto/update-favourite-status.dto';
import { Favourite } from '../entities/favourite.entity';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(Favourite)
    private favouritesRepository: Repository<Favourite>,
  ) {}

  async getFavouriteByCarId(carId: number, user: User): Promise<Favourite> {
    const found = await this.favouritesRepository.findOne({
      where: { car: { id: carId }, user: { id: user.id } },
    });

    if (!found) {
      return await this.createFavourite(carId, user);
    }

    return found;
  }

  async createFavourite(carId: number, user: User): Promise<Favourite> {
    return await this.favouritesRepository.save({
      car: { id: carId },
      user,
      status: true,
    });
  }

  async updateFavouriteStatus(
    updateFavouriteStatusDto: UpdateFavouriteStatusDto,
    user: User,
  ) {
    const { car_id, status } = updateFavouriteStatusDto;

    const favourite = await this.getFavouriteByCarId(car_id, user);

    favourite.status = status;
    await this.favouritesRepository.save(favourite);
  }
}
