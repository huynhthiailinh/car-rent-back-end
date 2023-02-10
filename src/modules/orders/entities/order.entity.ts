import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityAbstract } from '@common/base/base.entity';
import { OrderDetail } from './order-detail.entity';
import { OrderStatusEnum } from '../constants/order-status.enum';
import { PaymentMethodCodeEnum } from '../../payment-methods/constants/payment-method-code.enum';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';
import { Promo } from '../../promos/entities/promo.entity';
import { PromoTypeEnum } from '../../promos/constants/promo-type.enum';
import { IOrder } from '../interfaces/order.interface';

@Entity('orders')
export class Order extends EntityAbstract implements IOrder {
  @Column({
    nullable: true,
  })
  billingName: string;

  @Column({
    nullable: true,
  })
  billingPhoneNumber: string;

  @Column({
    nullable: true,
  })
  billingAddress: string;

  @Column({
    nullable: true,
  })
  billingCity: string;

  @Column({
    nullable: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.orders, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({
    type: 'enum',
    nullable: true,
    enum: PaymentMethodCodeEnum,
  })
  paymentMethodCode: PaymentMethodCodeEnum;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.order, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'payment_method_code', referencedColumnName: 'code' })
  paymentMethod: PaymentMethod;

  @Column({
    nullable: true,
  })
  promoCode: string;

  @ManyToOne(() => Promo, (promo) => promo.orders, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'promo_code', referencedColumnName: 'code' })
  promo: Promo;

  @Column({
    nullable: true,
  })
  discount: number;

  @Column({
    type: 'enum',
    nullable: true,
    enum: PromoTypeEnum,
  })
  promoType: PromoTypeEnum;

  @Column({
    nullable: true,
  })
  totalPrice: number;

  @Column({
    type: 'enum',
    nullable: true,
    default: OrderStatusEnum.Open,
    enum: OrderStatusEnum,
  })
  status: OrderStatusEnum;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    createForeignKeyConstraints: false,
  })
  details: OrderDetail[];
}
