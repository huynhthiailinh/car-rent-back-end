import { Injectable } from '@nestjs/common/decorators';
import { Car } from '@modules/cars/entities/car.entity';
import { OrderStatusEnum } from '@modules/orders/constants/order-status.enum';
import { Order } from '@modules/orders/entities/order.entity';
import { EntityManager } from 'typeorm';
import { PaymentInterface } from '../interfaces/payment.interface';

@Injectable()
export class StripeMethodService implements PaymentInterface {
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
        status: OrderStatusEnum.Proccessed,
      },
    );

    const order = await manager.findOne(Order, {
      where: {
        id: orderId,
      },
      relations: ['details'],
    });

    order.details.map(async (detail) => {
      await manager.update(
        Car,
        {
          id: detail.carId,
        },
        {
          rented: () => 'rented + 1',
        },
      );
    });

    return order;
  }
}
