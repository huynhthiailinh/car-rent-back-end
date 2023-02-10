import { Exclude, Expose, Type } from 'class-transformer';
import { PaginationSerializer } from '@common/serializers/responses/pagination.serializer';
import { OrderDto } from './order.dto';

@Exclude()
export class OrdersDto {
  @Expose()
  @Type(() => OrderDto)
  readonly items: OrderDto[];

  @Expose()
  readonly pagination: PaginationSerializer;
}
