import { Exclude, Expose, Transform } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class UserDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'id', null))
  id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'email', null))
  email: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'fullName', null))
  full_name: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'phoneNumber', null))
  phone_number: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'address', null))
  address: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'cityId', null))
  city_id: number;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'city.name', null))
  city_name: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'occupation', null))
  occupation: string;

  @Expose()
  @Transform(({ obj }) => _.get(obj, 'images.0.url', null))
  avatar_url: string;
}
