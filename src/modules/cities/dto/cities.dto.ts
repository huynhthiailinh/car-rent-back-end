import { Exclude, Expose, Type } from 'class-transformer';
import { PaginationSerializer } from '@common/serializers/responses/pagination.serializer';
import { CityDto } from './city.dto';

@Exclude()
export class CitiesDto {
  @Expose()
  @Type(() => CityDto)
  readonly items: CityDto[];

  @Expose()
  @Type(() => PaginationSerializer)
  readonly pagination: PaginationSerializer;
}
