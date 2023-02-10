import { EntityAbstract } from '@common/base/base.entity';
import { CarType } from '../../car-types/entities/car-type.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Car } from './car.entity';

@Entity('car_car_types')
export class CarCarType extends EntityAbstract {
  @Column({
    nullable: true,
  })
  carId: number;

  @ManyToOne(() => Car, (car) => car.types, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'car_id', referencedColumnName: 'id' })
  car: Car;

  @Column({
    nullable: true,
  })
  carTypeId: number;

  @ManyToOne(() => CarType, (carType) => carType.cars, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'car_type_id', referencedColumnName: 'id' })
  carType: CarType;
}
