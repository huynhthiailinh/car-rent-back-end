export const CarError = {
  CAR_NOT_FOUND: 'car.CAR-0001',
};

export const OrderError = {
  CAN_NOT_ORDER: 'order.ORD-0001',
  INVALID_PICK_UP_CITY: 'order.ORD-0002',
  INVALID_DROP_OFF_CITY: 'order.ORD-0003',
  CONFLICT_RENTAL_TIME: 'order.ORD-0004',
  INVALID_RENTAL_TIME: 'order.ORD-0005',
  RENTAL_TIME_IN_PAST: 'order.ORD-0006',
};

export const PromoError = {
  PROMO_NOT_FOUND: 'promo.PRO-0001',
  PROMO_EXPIRED: 'promo.PRO-0002',
  PROMO_QUANTITY_NOT_ENOUGH: 'promo.PRO-0003',
};

export const SystemError = {
  OBJECT_NOT_FOUND: 'system.CUS-0602',
  INVALID_PARAMETER: 'system.CUS-0603',
};

export const TokenError = {
  TOKEN_NOT_FOUND: 'token.TOK-0001',
  TOKEN_EXPIRED: 'user.CUS-0405',
};

export const UserError = {
  WRONG_CREDENTIALS: 'user.USE-0003',
  EMAIL_ALREADY_EXISTS: 'user.USE-0006',
  USER_NOT_FOUND: 'user.USE-0007',
  UNAUTHORIZED_ACCESS: 'user.CUS-0405',
};
