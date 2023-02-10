import { ICarTypeLanguage } from '@modules/car-types/interfaces/car-type-language.interface';
import { ICarLanguage } from '@modules/cars/interfaces/car-language.interface';

export interface ILanguage {
  code: string;
  carLanguages: ICarLanguage[];
  carTypeLanguages: ICarTypeLanguage[];
}
