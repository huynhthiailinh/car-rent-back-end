import { Exclude, Expose, Transform } from 'class-transformer';
import * as _ from 'lodash';

@Exclude()
export class LoginResponseDto {
  @Expose()
  @Transform(({ obj }) => _.get(obj, 'access_token', null))
  access_token: string;
}
