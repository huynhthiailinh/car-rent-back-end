import { EntityAbstract } from '@common/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CarLanguage } from './car-language.entity';
import { CarCity } from './car-city.entity';
import { OrderDetail } from '../../orders/entities/order-detail.entity';
import { CarCarType } from './car-car-type.entity';
import { Image } from '../../images/entities/image.entity';
import { Favourite } from '../../favourites/entities/favourite.entity';
import { ICar } from '../interfaces/car.interface';

@Entity('cars')
export class Car extends EntityAbstract implements ICar {
  @Column({
    nullable: true,
  })
  capacity: number;

  @Column({
    nullable: true,
  })
  gasoline: number;

  @Column({
    nullable: true,
  })
  newPrice: number;

  @Column({
    nullable: true,
  })
  oldPrice: number;

  @Column({
    nullable: true,
    default: 0,
  })
  rented: number;

  @Column({
    nullable: true,
  })
  averageRating: number;

  @OneToMany(() => CarLanguage, (carLanguage) => carLanguage.car, {
    createForeignKeyConstraints: false,
  })
  languages: CarLanguage[];

  @OneToMany(() => CarCity, (carCity) => carCity.car, {
    createForeignKeyConstraints: false,
  })
  cities: CarCity[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.car, {
    createForeignKeyConstraints: false,
  })
  orderDetails: OrderDetail[];

  @OneToMany(() => CarCarType, (carCarType) => carCarType.car, {
    createForeignKeyConstraints: false,
  })
  types: CarCarType[];

  @OneToMany(() => Image, (image) => image.car, {
    createForeignKeyConstraints: false,
  })
  images: Image[];

  @OneToMany(() => Favourite, (favourite) => favourite.car, {
    createForeignKeyConstraints: false,
  })
  favourites: Favourite[];
}
