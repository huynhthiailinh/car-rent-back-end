import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { EntityAbstract } from '@common/base/base.entity';
import { PaymentMethodCodeEnum } from '../constants/payment-method-code.enum';
import { Order } from '../../orders/entities/order.entity';
import { IPaymentMethod } from '../interfaces/payment-method.interface';

@Entity('payment_methods')
export class PaymentMethod extends EntityAbstract implements IPaymentMethod {
  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: PaymentMethodCodeEnum,
  })
  code: PaymentMethodCodeEnum;

  @Column({
    nullable: true,
  })
  orderId: number;

  @OneToMany(() => Order, (order) => order.paymentMethod, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;
}
