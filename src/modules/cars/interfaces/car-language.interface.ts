import { CarSteeringEnum } from '../constants/car-steering.enum';

export interface ICarLanguage {
  languageCode: string;
  carId: number;
  name: string;
  description: string;
  steering: CarSteeringEnum;
}
