import { IOrder } from '@modules/orders/interfaces/order.interface';
import { PromoTypeEnum } from '../constants/promo-type.enum';

export interface IPromo {
  code: string;
  discount: number;
  type: PromoTypeEnum;
  quantity: number;
  isLimited: boolean;
  startedAt: Date;
  endedAt: Date;
  orders: IOrder[];
}
