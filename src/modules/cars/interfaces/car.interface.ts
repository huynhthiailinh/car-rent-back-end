import { IFavourite } from '@modules/favourites/interfaces/favourite.interface';
import { IImage } from '@modules/images/interfaces/image.interface';
import { IOrderDetail } from '@modules/orders/interfaces/order-detail.interface';
import { ICarCarType } from './car-car-type.interface';
import { ICarCity } from './car-city.interface';
import { ICarLanguage } from './car-language.interface';

export interface ICar {
  capacity: number;
  gasoline: number;
  newPrice: number;
  oldPrice: number;
  rented: number;
  averageRating: number;
  languages: ICarLanguage[];
  cities: ICarCity[];
  orderDetails: IOrderDetail[];
  types: ICarCarType[];
  images: IImage[];
  favourites: IFavourite[];
}
