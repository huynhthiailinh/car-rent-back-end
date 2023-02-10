import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { CarError, SystemError } from '@common/constants/error-message';
import {
  PAGINATE_LIMIT_DEFAULT,
  PAGINATE_OFFSET_DEFAULT,
} from '@common/constants/pagination';
import { ApplicationError } from 'src/common/errors/application.error';
import { Favourite } from '@modules/favourites/entities/favourite.entity';
import { Order } from '@modules/orders/entities/order.entity';
import {
  Between,
  In,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';
import { ImageTypeEnum } from '../../images/constants/image-type.enum';
import { OrderStatusEnum } from '../../orders/constants/order-status.enum';
import { Review } from '../../reviews/entities/review.entity';
import { User } from '../../users/entities/user.entity';
import { CarListTypeEnum } from '../constants/car-list-type.enum';
import { MAX_CAPACITY_DEFAULT } from '../constants/get-cars-filter.constant';
import {
  GetCapacityListIncludeEnum,
  GetCarByIdIncludeEnum,
} from '../constants/include.enum';
import { RentalActionEnum } from '../constants/rental-action.enum';
import { GetCapacityListFilterDto } from '../dto/get-capacity-list-filter.dto';
import { GetCarByIdQueryDto } from '../dto/get-car-by-id-query.dto';
import { GetCarsFilterDto } from '../dto/get-cars-filter.dto';
import { GetRentedDatesQueryDto } from '../dto/get-rented-dates-query.dto';
import { Car } from '../entities/car.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,

    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,

    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(Favourite)
    private favouritesRepository: Repository<Favourite>,
  ) {}

  async getCars(filterDto: GetCarsFilterDto, languageCode: string, user: User) {
    const { limit, offset } = filterDto;

    const [data, total] = await this.getCarsWithFilter(
      filterDto,
      languageCode,
      limit || PAGINATE_LIMIT_DEFAULT,
      offset || PAGINATE_OFFSET_DEFAULT,
    );

    if (user) {
      for (const car of data) {
        const favourite = await this.favouritesRepository.findOne({
          where: {
            carId: car.id,
            userId: user.id,
          },
        });
        car['favourite_status'] = favourite ? favourite.status : false;
      }
    }

    return {
      items: data,
      pagination: {
        total: total,
        limit: limit || PAGINATE_LIMIT_DEFAULT,
        offset: offset || PAGINATE_OFFSET_DEFAULT,
      },
    };
  }

  async getCarsWithFilter(
    filterDto: GetCarsFilterDto,
    languageCode: string,
    limit?: number,
    offset?: number,
  ) {
    const {
      pick_up_city_id,
      pick_up_at,
      drop_off_city_id,
      drop_off_at,
      order_by,
      search,
      type,
      capacity,
      max_price,
    } = filterDto;

    const whereData = {
      capacity: capacity
        ? capacity.includes(MAX_CAPACITY_DEFAULT)
          ? In(capacity) || MoreThan(MAX_CAPACITY_DEFAULT)
          : In(capacity)
        : undefined,
      newPrice: max_price ? LessThanOrEqual(max_price) : undefined,
      languages: {
        languageCode,
        name: search
          ? Raw(
              (alias) =>
                `MATCH (${alias}) AGAINST (":search*" IN BOOLEAN MODE)`,
              { search },
            )
          : undefined,
      },
      types: {
        carType: {
          id: type ? In(type) : undefined,
          languages: {
            languageCode,
          },
        },
      },
      images: {
        objectType: ImageTypeEnum.CarThumbnail,
      },
    };

    if (pick_up_city_id) {
      whereData['cities'] = {
        cityId: pick_up_city_id,
        action: RentalActionEnum.PickUp,
      };
    }

    if (drop_off_city_id) {
      whereData['cities'] = {
        cityId: drop_off_city_id,
        action: RentalActionEnum.DropOff,
      };
    }

    if (pick_up_at || drop_off_at) {
      const carIds = await this.getAvailableCarIds(pick_up_at, drop_off_at);

      if (carIds.length) {
        whereData['id'] = In(carIds.map((id) => id));
      }
    }

    return this.carsRepository.findAndCount({
      where: whereData,
      order: {
        rented: order_by === CarListTypeEnum.Popular ? 'DESC' : undefined,
        averageRating:
          order_by === CarListTypeEnum.Recommend ? 'DESC' : undefined,
      },
      skip: offset ? offset : undefined,
      take: limit ? limit : undefined,
      relations: {
        languages: true,
        types: {
          carType: {
            languages: true,
          },
        },
        images: true,
      },
    });
  }

  async getCapacityList(filterDto: GetCapacityListFilterDto, cars?: Car[]) {
    const { max_capacity, include } = filterDto;

    const query = this.carsRepository.createQueryBuilder('cars');

    if (cars.length) {
      query.andWhere('cars.id IN (:...carIds)', {
        carIds: cars.map((car) => car.id),
      });
    }

    query
      .select('cars.capacity', 'capacity')
      .groupBy('cars.capacity')
      .orderBy('cars.capacity', 'ASC');

    if (max_capacity) {
      query.andWhere('cars.capacity <= :maxCapacity', {
        maxCapacity: max_capacity,
      });
    }

    if (include) {
      if (include.includes(GetCapacityListIncludeEnum.CountCars)) {
        if (max_capacity) {
          query.addSelect(
            `(CASE WHEN capacity = ${max_capacity} THEN (SELECT COUNT(*) FROM cars WHERE capacity >= ${max_capacity}) ELSE COUNT(*) END)`,
            'count',
          );
        } else {
          query.addSelect('COUNT(*)', 'count');
        }
      }
    }

    return { items: await query.getRawMany() };
  }

  async getCarById(
    id: number,
    queryDto: GetCarByIdQueryDto,
    languageCode: string,
    user: User,
  ): Promise<Car> {
    const { include } = queryDto;

    const whereData = {
      id,
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
        objectType: In([ImageTypeEnum.CarThumbnail, ImageTypeEnum.Car]),
      },
    };

    const relationsData = {
      languages: true,
      types: {
        carType: {
          languages: true,
        },
      },
      images: true,
    };

    const car = await this.carsRepository.findOne({
      where: whereData,
      relations: relationsData,
      order: {
        images: {
          objectType: 'DESC',
        },
      },
    });

    if (!car) {
      throw new ApplicationError(SystemError.INVALID_PARAMETER, [
        {
          key: CarError.CAR_NOT_FOUND,
          field: 'id',
        },
      ]);
    }

    if (user) {
      const favourite = await this.favouritesRepository.findOne({
        where: {
          carId: id,
          userId: user.id,
        },
      });

      car['favourite_status'] = favourite ? favourite.status : false;
    }

    if (include) {
      if (include.includes(GetCarByIdIncludeEnum.TotalReviewers)) {
        const reviewQuery = this.reviewsRepository
          .createQueryBuilder('reviews')
          .where('reviews.car_id = :id', { id });
        car['total_reviewers'] = await reviewQuery
          .select('COUNT(DISTINCT(user_id))', 'result')
          .getRawOne();
      }
    }

    return car;
  }

  async getAvailableCarIds(
    pick_up_at: Date,
    drop_off_at: Date,
  ): Promise<number[]> {
    const cars = await this.carsRepository.find();

    const availableCarIds = [];

    for (const car of cars) {
      const conflictOrder = await this.getConflictOrders(
        car.id,
        pick_up_at,
        drop_off_at,
        true,
      );

      if (!conflictOrder) {
        availableCarIds.push(car.id);
      }
    }

    return availableCarIds;
  }

  async getConflictOrders(
    car_id: number,
    pick_up_at: Date,
    drop_off_at: Date,
    getOne?: boolean,
  ): Promise<Order | Order[]> {
    if (pick_up_at && drop_off_at) {
      const whereData = [
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
      ];

      if (getOne) {
        return this.ordersRepository.findOne({ where: whereData });
      }

      return this.ordersRepository.find({
        where: whereData,
        relations: {
          details: true,
        },
      });
    } else if (pick_up_at || drop_off_at) {
      const whereData = {
        status: In([
          OrderStatusEnum.Open,
          OrderStatusEnum.UnPaid,
          OrderStatusEnum.Proccessed,
        ]),
        details: {
          carId: car_id,
          pickUpAt: LessThanOrEqual(pick_up_at || drop_off_at),
          dropOffAt: MoreThanOrEqual(pick_up_at || drop_off_at),
        },
      };

      if (getOne) {
        return this.ordersRepository.findOne({ where: whereData });
      }

      return this.ordersRepository.find({
        where: whereData,
        relations: {
          details: true,
        },
      });
    }

    return null;
  }

  async getRentedDatesByCarId(carId: number, queryDto: GetRentedDatesQueryDto) {
    const { start_at, end_at } = queryDto;

    const conflictOrders = await this.getConflictOrders(
      carId,
      start_at,
      end_at,
    );

    if (!conflictOrders) {
      return { items: [] };
    }

    const rentedDates = [];

    const orders = Array.isArray(conflictOrders)
      ? conflictOrders
      : [conflictOrders];

    for (const order of orders) {
      for (const detail of order.details) {
        rentedDates.push({
          start_at:
            moment(detail.pickUpAt).diff(start_at) > 0
              ? detail.pickUpAt
              : start_at,
          end_at:
            moment(detail.dropOffAt).diff(end_at) > 0
              ? detail.dropOffAt
              : end_at,
        });
      }
    }

    return { items: rentedDates };
  }
}
