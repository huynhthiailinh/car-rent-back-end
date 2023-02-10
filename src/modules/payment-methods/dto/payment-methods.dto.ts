import { Exclude, Expose, Type } from 'class-transformer';
import { PaginationSerializer } from '@common/serializers/responses/pagination.serializer';
import { PaymentMethodDto } from './payment-method.dto';

@Exclude()
export class PaymentMethodsDto {
  @Expose()
  @Type(() => PaymentMethodDto)
  readonly items: PaymentMethodDto[];

  @Expose()
  @Type(() => PaginationSerializer)
  readonly pagination: PaginationSerializer;
}
