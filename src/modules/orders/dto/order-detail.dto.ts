import { Exclude, Expose, Transform } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class OrderDetailDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'carId', null))
  readonly id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'car.languages.0.name', null))
  readonly name: string;

  readonly car: any;

  @Expose()
  @Transform(({ obj }) =>
    obj.car.types
      .map((type) => type.carType)
      .map((type) => type.languages[0])
      .map((type) => ({ id: type.id, name: type.name })),
  )
  readonly types: any;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'car.images.0.url', null))
  readonly thumbnail_url: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'pickUpCityId', null))
  readonly pick_up_city_id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'pickUpCity.name', null))
  readonly pick_up_city: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'pickUpAt', null))
  readonly pick_up_at: Date;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'dropOffCityId', null))
  readonly drop_off_city_id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'dropOffCity.name', null))
  readonly drop_off_city: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'dropOffAt', null))
  readonly drop_off_at: Date;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'subPrice', null))
  readonly sub_price: number;
}
