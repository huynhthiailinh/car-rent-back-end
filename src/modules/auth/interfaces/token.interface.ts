import { AuthTokenEnum } from '../constants/auth-token.constant';

export interface IToken {
  type: AuthTokenEnum;
  expiredAt: Date;
  userId: number;
}
