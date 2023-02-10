import { ImageTypeEnum } from '../constants/image-type.enum';

export interface IImage {
  objectId: number;
  objectType: ImageTypeEnum;
  url: string;
}
