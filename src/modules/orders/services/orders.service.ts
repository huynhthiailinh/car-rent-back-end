import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import {
  Between,
  EntityManager,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Order } from '../entities/order.entity';
import { Car } from '../../cars/entities/car.entity';
import { Promo } from '../../promos/entities/promo.entity';
import { PromoTypeEnum } from '../../promos/constants/promo-type.enum';
import {
  PAGINATE_LIMIT_DEFAULT,
  PAGINATE_OFFSET_DEFAULT,
} from '@common/constants/pagination';
import { GetOrdersFilterDto } from '../dto/get-orders-filter.dto';
import { OrderStatusEnum } from '../constants/order-status.enum';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderDetail } from '../entities/order-detail.entity';
import { ImageTypeEnum } from '@modules/images/constants/image-type.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
  ) {}

  async getOrders(
    user: User,
    getOrdersFilterDto: GetOrdersFilterDto,
    languageCode: string,
  ) {
    const { limit, offset } = getOrdersFilterDto;

    const [data, total] = await this.ordersRepository.findAndCount({
      where: {
        user: {
          id: user.id,
        },
        details: {
          car: {
            languages: {
              languageCode,
            },
            types: {
              carType: {
                languages: {
                  languageCode,
                },
              },
            },
            images: {
              objectType: ImageTypeEnum.CarThumbnail,
            },
          },
        },
      },
      skip: offset || PAGINATE_OFFSET_DEFAULT,
      take: limit || PAGINATE_LIMIT_DEFAULT,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        details: {
          car: {
            languages: true,
            types: {
              carType: {
                languages: true,
              },
            },
            images: true,
          },
          pickUpCity: true,
          dropOffCity: true,
        },
      },
    });

    return {
      items: data,
      pagination: {
        total: total,
        limit: limit || PAGINATE_LIMIT_DEFAULT,
        offset: offset || PAGINATE_OFFSET_DEFAULT,
      },
    };
  }

  async getOrderById(user: User, id: number, languageCode: string) {
    const query = this.ordersRepository
      .createQueryBuilder('orders')
      .where('orders.id = :id', { id })
      .andWhere('orders.userId = :userId', { userId: user.id })
      .leftJoinAndSelect('orders.details', 'orderDetails')
      .leftJoinAndSelect('orderDetails.car', 'car')
      .leftJoinAndSelect(
        'car.languages',
        'carLanguages',
        'carLanguages.languageCode = :languageCode',
        { languageCode },
      )
      .leftJoinAndSelect('car.types', 'carTypes')
      .leftJoinAndSelect('carTypes.carType', 'carType')
      .leftJoinAndSelect(
        'carType.languages',
        'carTypeLanguages',
        'carTypeLanguages.languageCode = :languageCode',
        {
          languageCode,
        },
      )
      .leftJoinAndSelect(
        'car.images',
        'carImages',
        'carImages.objectType = :type',
        {
          type: ImageTypeEnum.CarThumbnail,
        },
      )
      .leftJoinAndSelect('orderDetails.pickUpCity', 'pickUpCity')
      .leftJoinAndSelect('orderDetails.dropOffCity', 'dropOffCity');
    return query.getOne();
  }

  async getConflictOrderWithTransaction(
    car_id: number,
    pick_up_at: Date,
    drop_off_at: Date,
    manager: EntityManager,
  ): Promise<Order> {
    return manager.findOne(Order, {
      where: [
        {
          status: In([
            OrderStatusEnum.Open,
            OrderStatusEnum.UnPaid,
            OrderStatusEnum.Proccessed,
          ]),
          details: {
            carId: car_id,
            pickUpAt: Between(pick_up_at, drop_off_at),
          },
        },
        {
          status: In([
            OrderStatusEnum.Open,
            OrderStatusEnum.UnPaid,
            OrderStatusEnum.Proccessed,
          ]),
          details: {
            carId: car_id,
            dropOffAt: Between(pick_up_at, drop_off_at),
          },
        },
        {
          status: In([
            OrderStatusEnum.Open,
            OrderStatusEnum.UnPaid,
            OrderStatusEnum.Proccessed,
          ]),
          details: {
            carId: car_id,
            pickUpAt: LessThanOrEqual(pick_up_at),
            dropOffAt: MoreThanOrEqual(drop_off_at),
          },
        },
      ],
      relations: ['details'],
      lock: { mode: 'pessimistic_write' },
    });
  }

  async saveOrderWithTransaction(
    createOrderDto: CreateOrderDto,
    user: User,
    car: Car,
    promo: Promo | null,
    manager: EntityManager,
  ): Promise<Order> {
    const {
      billing_name,
      billing_phone_number,
      billing_address,
      billing_city,
      payment_method_code,
      pick_up_city_id,
      drop_off_city_id,
      pick_up_at,
      drop_off_at,
    } = createOrderDto;

    return manager.save(Order, {
      billingName: billing_name,
      billingPhoneNumber: billing_phone_number,
      billingAddress: billing_address,
      billingCity: billing_city,
      userId: user.id,
      paymentMethodCode: payment_method_code,
      promoCode: promo?.code,
      discount: promo?.discount,
      promoType: promo?.type,
      totalPrice: await this.calculateTotalPrice(
        car,
        promo,
        pick_up_at,
        drop_off_at,
      ),
      status: OrderStatusEnum.Open,
      details: [
        await manager.save(OrderDetail, {
          carId: car.id,
          pickUpCityId: pick_up_city_id,
          dropOffCityId: drop_off_city_id,
          pickUpAt: pick_up_at,
          dropOffAt: drop_off_at,
          subPrice: car.newPrice,
        }),
      ],
    });
  }

  async calculateTotalPrice(
    car: Car,
    promo: Promo,
    pickUpAt: Date,
    dropOffAt: Date,
  ): Promise<number> {
    let result = 0;

    result += car.newPrice;

    const pickUpDate = new Date(new Date(pickUpAt).toJSON().slice(0, 10));

    const dropOffDate = new Date(new Date(dropOffAt).toJSON().slice(0, 10));

    const diffDays = Math.ceil(
      (dropOffDate.getTime() - pickUpDate.getTime()) / (1000 * 3600 * 24) + 1,
    );

    result = result * diffDays;

    if (promo) {
      if (promo.type === PromoTypeEnum.Percentage) {
        result = result - result * (promo.discount / 100);
      } else if (promo.type === PromoTypeEnum.Absolute) {
        result = result - promo.discount;
      }
    }

    return result;
  }
}
