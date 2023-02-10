import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCitiesFilterDto } from '../dto/get-cities-filter.dto';
import { City } from '../entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  async getCities(filterDto: GetCitiesFilterDto) {
    const { car_id, action, limit, offset } = filterDto;

    const query = this.citiesRepository
      .createQueryBuilder('cities')
      .leftJoinAndSelect('cities.cars', 'carCities');

    if (car_id) query.where('carCities.carId = :car_id', { car_id });

    if (action) query.andWhere('carCities.action = :action', { action });

    query.take(limit || 4).skip(offset || 0);

    return {
      items: await query.getMany(),
      pagination: {
        total: await query.getCount(),
        limit: limit || 4,
        offset: offset || 0,
      },
    };
  }
}
