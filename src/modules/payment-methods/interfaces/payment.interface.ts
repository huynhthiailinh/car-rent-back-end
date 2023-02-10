import { Order } from '@modules/orders/entities/order.entity';
import { EntityManager } from 'typeorm';

export interface PaymentInterface {
  startPayment(orderId: number, manager: EntityManager): Promise<Order>;
}
