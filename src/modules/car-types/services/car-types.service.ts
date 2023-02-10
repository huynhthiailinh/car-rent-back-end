import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '@modules/cars/entities/car.entity';
import { Repository } from 'typeorm';
import { GetCarTypesFilterDto } from '../dto/get-car-types-filter.dto';
import { GetCarTypesIncludeEnum } from '../dto/include.enum';
import { CarType } from '../entities/car-type.entity';

@Injectable()
export class CarTypesService {
  constructor(
    @InjectRepository(CarType)
    private carTypesRepository: Repository<CarType>,
  ) {}

  async getCarTypeList(
    filterDto: GetCarTypesFilterDto,
    languageCode: string,
    cars?: Car[],
  ) {
    const { include } = filterDto;

    const query = this.carTypesRepository
      .createQueryBuilder('carTypes')
      .leftJoinAndSelect(
        'carTypes.languages',
        'carTypeLanguages',
        'carTypeLanguages.language_code = :language_code',
        {
          language_code: languageCode,
        },
      );

    if (cars.length) {
      query.innerJoinAndSelect(
        'carTypes.cars',
        'cars',
        'cars.car_id IN (:...carIds)',
        {
          carIds: cars.map((car) => car.id),
        },
      );
    }

    if (include) {
      if (include.includes(GetCarTypesIncludeEnum.CountCars)) {
        query.loadRelationCountAndMap('carTypes.count', 'carTypes.cars');
      }
    }

    return { items: await query.getMany() };
  }
}
