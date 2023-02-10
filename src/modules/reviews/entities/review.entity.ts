import { EntityAbstract } from '@common/base/base.entity';
import { OrderDetail } from '../../orders/entities/order-detail.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('reviews')
export class Review extends EntityAbstract {
  @Column({
    nullable: true,
  })
  orderDetailId: number;

  @ManyToOne(() => OrderDetail, (orderDetail) => orderDetail.reviews, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'order_detail_id', referencedColumnName: 'id' })
  orderDetail: OrderDetail;

  @Column({
    nullable: true,
  })
  userId: number;

  @Column({
    nullable: true,
  })
  carId: number;

  @Column({
    nullable: true,
  })
  content: string;

  @Column({
    nullable: true,
    type: 'tinyint',
  })
  rating: number;
}
