import { EntityAbstract } from '@common/base/base.entity';
import { CarCarType } from '../../cars/entities/car-car-type.entity';
import { Entity, OneToMany } from 'typeorm';
import { CarTypeLanguage } from './car-type-language.entity';

@Entity('car_types')
export class CarType extends EntityAbstract {
  @OneToMany(
    () => CarTypeLanguage,
    (carTypeLanguage) => carTypeLanguage.carType,
    {
      createForeignKeyConstraints: false,
    },
  )
  languages: CarTypeLanguage[];

  @OneToMany(() => CarCarType, (carCarType) => carCarType.carType, {
    createForeignKeyConstraints: false,
  })
  cars: CarCarType[];
}
