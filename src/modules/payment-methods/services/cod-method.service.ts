import { Injectable } from '@nestjs/common';
import { OrderStatusEnum } from '@modules/orders/constants/order-status.enum';
import { Order } from '@modules/orders/entities/order.entity';
import { EntityManager } from 'typeorm';
import { PaymentInterface } from '../interfaces/payment.interface';

@Injectable()
export class CodMethodService implements PaymentInterface {
  public async startPayment(
    orderId: number,
    manager: EntityManager,
  ): Promise<Order> {
    await manager.update(
      Order,
      {
        id: orderId,
      },
      {
        status: OrderStatusEnum.UnPaid,
      },
    );

    return manager.findOne(Order, {
      where: {
        id: orderId,
      },
      relations: ['details'],
    });
  }
}
