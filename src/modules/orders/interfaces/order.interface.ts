import { PaymentMethodCodeEnum } from '@modules/payment-methods/constants/payment-method-code.enum';
import { PromoTypeEnum } from '@modules/promos/constants/promo-type.enum';
import { OrderStatusEnum } from '../constants/order-status.enum';
import { IOrderDetail } from './order-detail.interface';

export interface IOrder {
  billingName: string;
  billingPhoneNumber: string;
  billingAddress: string;
  billingCity: string;
  userId: number;
  paymentMethodCode: PaymentMethodCodeEnum;
  promoCode: string;
  discount: number;
  promoType: PromoTypeEnum;
  totalPrice: number;
  status: OrderStatusEnum;
  details: IOrderDetail[];
}
