import { Exclude, Expose, Type } from 'class-transformer';
import { PaginationSerializer } from '@common/serializers/responses/pagination.serializer';
import { CarDto } from './car.dto';
import * as _ from 'lodash';

@Exclude()
export class CarsDto {
  @Expose()
  @Type(() => CarDto)
  readonly items: CarDto[];

  @Expose()
  @Type(() => PaginationSerializer)
  readonly pagination: PaginationSerializer;
}
