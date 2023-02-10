import { IToken } from '@modules/auth/interfaces/token.interface';
import { IFavourite } from '@modules/favourites/interfaces/favourite.interface';
import { IImage } from '@modules/images/interfaces/image.interface';
import { IOrder } from '@modules/orders/interfaces/order.interface';

export interface IUser {
  email: string;
  hashedPassword: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  cityId: number;
  occupation: string;
  verifiedAt: Date;
  tokens: IToken[];
  orders: IOrder[];
  images: IImage[];
  favourites: IFavourite[];
}
