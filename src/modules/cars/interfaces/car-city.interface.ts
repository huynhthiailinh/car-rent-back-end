import { RentalActionEnum } from '../constants/rental-action.enum';

export interface ICarCity {
  carId: number;
  cityId: number;
  action: RentalActionEnum;
}
