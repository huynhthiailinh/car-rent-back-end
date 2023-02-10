import { EntityAbstract } from '@common/base/base.entity';
import { CarCity } from '../../cars/entities/car-city.entity';
import { OrderDetail } from '../../orders/entities/order-detail.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ICity } from '../interfaces/city.interface';

@Entity('cities')
export class City extends EntityAbstract implements ICity {
  @Column({
    nullable: true,
  })
  name: string;

  @OneToMany(() => User, (user) => user.city, {
    createForeignKeyConstraints: false,
  })
  users: User[];

  @OneToMany(() => CarCity, (carCity) => carCity.city, {
    createForeignKeyConstraints: false,
  })
  cars: CarCity[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.pickUpCity, {
    createForeignKeyConstraints: false,
  })
  pickUpOrderDetails: OrderDetail[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.dropOffCity, {
    createForeignKeyConstraints: false,
  })
  dropOffOrderDetails: OrderDetail[];
}
