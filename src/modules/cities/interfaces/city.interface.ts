import { ICarCity } from '@modules/cars/interfaces/car-city.interface';
import { IOrderDetail } from '@modules/orders/interfaces/order-detail.interface';
import { IUser } from '@modules/users/interfaces/user.interface';

export interface ICity {
  name: string;
  users: IUser[];
  cars: ICarCity[];
  pickUpOrderDetails: IOrderDetail[];
  dropOffOrderDetails: IOrderDetail[];
}
