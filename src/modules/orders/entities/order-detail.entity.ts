import { EntityAbstract } from '@common/base/base.entity';
import { Car } from '../../cars/entities/car.entity';
import { City } from '../../cities/entities/city.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { IOrderDetail } from '../interfaces/order-detail.interface';

@Entity('order_details')
export class OrderDetail extends EntityAbstract implements IOrderDetail {
  @Column({
    nullable: true,
  })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.details, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @Column({
    nullable: true,
  })
  carId: number;

  @ManyToOne(() => Car, (car) => car.orderDetails, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'car_id', referencedColumnName: 'id' })
  car: Car;

  @Column({
    nullable: true,
  })
  pickUpCityId: number;

  @ManyToOne(() => City, (city) => city.pickUpOrderDetails, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'pick_up_city_id', referencedColumnName: 'id' })
  pickUpCity: City;

  @Column({
    nullable: true,
  })
  dropOffCityId: number;

  @ManyToOne(() => City, (city) => city.dropOffOrderDetails, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'drop_off_city_id', referencedColumnName: 'id' })
  dropOffCity: City;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  pickUpAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dropOffAt: Date;

  @Column({
    nullable: true,
    default: 1,
  })
  amount: number;

  @Column({
    nullable: true,
  })
  subPrice: number;

  @OneToMany(() => Review, (review) => review.orderDetail, {
    createForeignKeyConstraints: false,
  })
  reviews: Review[];
}
