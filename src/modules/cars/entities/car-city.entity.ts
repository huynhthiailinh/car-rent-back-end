import { EntityAbstract } from '@common/base/base.entity';
import { City } from '../../cities/entities/city.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RentalActionEnum } from '../constants/rental-action.enum';
import { Car } from './car.entity';
import { ICarCity } from '../interfaces/car-city.interface';

@Entity('car_cities')
export class CarCity extends EntityAbstract implements ICarCity {
  @Column({
    nullable: true,
  })
  carId: number;

  @ManyToOne(() => Car, (car) => car.cities, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'car_id', referencedColumnName: 'id' })
  car: Car;

  @Column({
    nullable: true,
  })
  cityId: number;

  @ManyToOne(() => City, (city) => city.cars, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city: City;

  @Column({
    type: 'enum',
    nullable: true,
    enum: RentalActionEnum,
  })
  action: RentalActionEnum;
}
