import { ICarCarType } from '@modules/cars/interfaces/car-car-type.interface';
import { ICarTypeLanguage } from './car-type-language.interface';

export interface ICarType {
  languages: ICarTypeLanguage[];
  cars: ICarCarType[];
}
