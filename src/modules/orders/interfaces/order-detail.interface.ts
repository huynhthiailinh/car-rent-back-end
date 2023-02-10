import { IReview } from '@modules/reviews/interfaces/review.interface';

export interface IOrderDetail {
  orderId: number;
  carId: number;
  pickUpCityId: number;
  dropOffCityId: number;
  pickUpAt: Date;
  dropOffAt: Date;
  amount: number;
  subPrice: number;
  reviews: IReview[];
}
