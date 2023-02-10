import { EntityAbstract } from '@common/base/base.entity';
import { Order } from '../../orders/entities/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { PromoTypeEnum } from '../constants/promo-type.enum';
import { IPromo } from '../interfaces/promo.interface';

@Entity('promos')
export class Promo extends EntityAbstract implements IPromo {
  @Column({
    nullable: true,
  })
  code: string;

  @Column({
    nullable: true,
  })
  discount: number;

  @Column({
    type: 'enum',
    nullable: true,
    enum: PromoTypeEnum,
  })
  type: PromoTypeEnum;

  @Column({
    nullable: true,
  })
  quantity: number;

  @Column({
    nullable: true,
  })
  isLimited: boolean;

  @Column({
    nullable: true,
  })
  startedAt: Date;

  @Column({
    nullable: true,
  })
  endedAt: Date;

  @OneToMany(() => Order, (order) => order.promo)
  orders: Order[];
}
