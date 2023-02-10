import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseSerializer {
  @Expose()
  data: any;
}
