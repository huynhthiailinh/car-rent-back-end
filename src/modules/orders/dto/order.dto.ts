import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { OrderDetailDto } from './order-detail.dto';
import * as _ from 'lodash';

@Exclude()
export class OrderDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'id', null))
  id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'createdAt', null))
  created_at: Date;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'billingName', null))
  billing_name: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'billingPhoneNumber', null))
  billing_phone_number: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'billingAddress', null))
  billing_address: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'billingCity', null))
  billing_city: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'paymentMethodCode', null))
  payment_method_code: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'promoCode', null))
  promo_code: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'totalPrice', null))
  total_price: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'status', null))
  status: string;

  @Expose()
  @Type(() => OrderDetailDto)
  details: OrderDetailDto[];
}
