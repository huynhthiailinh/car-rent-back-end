import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Inject, Param, Query } from '@nestjs/common/decorators';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Serialize } from '@common/interceptors/serialize.interceptor';
import { Car } from '@modules/cars/entities/car.entity';
import { DataSource } from 'typeorm';
import { CurrentUser } from '../../../common/decorators/requests/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MailService } from '@shared/mail/services/mail.service';
import { PaymentInterface } from '../../payment-methods/interfaces/payment.interface';
import { User } from '../../users/entities/user.entity';
import { OrderStatusEnum } from '../constants/order-status.enum';
import { CreateOrderDto } from '../dto/create-order.dto';
import { GetOrdersFilterDto } from '../dto/get-orders-filter.dto';
import { OrderDto } from '../dto/order.dto';
import { OrdersDto } from '../dto/orders.dto';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../services/orders.service';
import { CarCity } from '@modules/cars/entities/car-city.entity';
import { RentalActionEnum } from '@modules/cars/constants/rental-action.enum';
import { Promo } from '@modules/promos/entities/promo.entity';
import { PromosService } from '@modules/promos/services/promos.service';
import {
  ApplicationError,
  ChildError,
} from 'src/common/errors/application.error';
import { CarError, OrderError } from '@common/constants/error-message';
import * as moment from 'moment';

@ApiBearerAuth('accessToken')
@ApiTags('Orders')
@Controller({
  version: '1',
  path: 'orders',
})
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private promosService: PromosService,
    @Inject('PaymentInterface')
    private paymentMethodInterface: PaymentInterface,
    private mailService: MailService,
    private readonly dataSource: DataSource,
  ) {}

  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language code ("en", "ja", etc fallback to "en")',
    required: false,
  })
  @ApiOperation({ summary: 'Get my orders' })
  @Serialize(OrdersDto)
  @Get()
  getOrders(
    @CurrentUser() user: User,
    @I18n() i18n: I18nContext,
    @Query() getOrdersFilterDto: GetOrdersFilterDto,
  ) {
    return this.ordersService.getOrders(user, getOrdersFilterDto, i18n.lang);
  }

  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language code ("en", "ja", etc fallback to "en")',
    required: false,
  })
  @ApiOperation({ summary: 'Get order by id' })
  @Serialize(OrderDto)
  @Get('/:id')
  getOrderById(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @I18n() i18n: I18nContext,
  ) {
    return this.ordersService.getOrderById(user, id, i18n.lang);
  }

  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language code ("en", "ja", etc fallback to "en")',
    required: false,
  })
  @ApiOperation({ summary: 'Create an order' })
  @Serialize(Order)
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: User,
  ) {
    const {
      car_id,
      pick_up_city_id,
      pick_up_at,
      drop_off_city_id,
      drop_off_at,
      promo_code,
    } = createOrderDto;

    const childErrors: ChildError[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const car = await queryRunner.manager.findOne(Car, {
        where: { id: car_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!car) {
        childErrors.push({
          key: CarError.CAR_NOT_FOUND,
          field: 'car_id',
        });
        throw new ApplicationError(OrderError.CAN_NOT_ORDER, childErrors);
      }

      const pickUpCity = await queryRunner.manager.findOne(CarCity, {
        where: {
          carId: car_id,
          cityId: pick_up_city_id,
          action: RentalActionEnum.PickUp,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!pickUpCity) {
        childErrors.push({
          key: OrderError.INVALID_PICK_UP_CITY,
          field: 'pick_up_city_id',
        });
      }

      const dropOffCity = await queryRunner.manager.findOne(CarCity, {
        where: {
          carId: car_id,
          cityId: drop_off_city_id,
          action: RentalActionEnum.DropOff,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!dropOffCity) {
        childErrors.push({
          key: OrderError.INVALID_DROP_OFF_CITY,
          field: 'drop_off_city_id',
        });
      }

      if (moment().diff(pick_up_at, 'hours') > -13) {
        childErrors.push({
          key: OrderError.RENTAL_TIME_IN_PAST,
          field: 'pick_up_at',
        });
      }

      if (moment().diff(drop_off_at, 'hours') > -13) {
        childErrors.push({
          key: OrderError.RENTAL_TIME_IN_PAST,
          field: 'drop_off_at',
        });
      }

      if (childErrors.length) {
        throw new ApplicationError(OrderError.CAN_NOT_ORDER, childErrors);
      }

      if (drop_off_at <= pick_up_at) {
        childErrors.push({
          key: OrderError.INVALID_RENTAL_TIME,
          field: 'drop_off_at',
        });
      }

      if (childErrors.length) {
        throw new ApplicationError(OrderError.CAN_NOT_ORDER, childErrors);
      }

      const conflictRentalTime =
        await this.ordersService.getConflictOrderWithTransaction(
          car_id,
          pick_up_at,
          drop_off_at,
          queryRunner.manager,
        );

      if (conflictRentalTime) {
        childErrors.push({
          key: OrderError.CONFLICT_RENTAL_TIME,
          field: 'pick_up_at',
        });
        childErrors.push({
          key: OrderError.CONFLICT_RENTAL_TIME,
          field: 'drop_off_at',
        });
      }

      let promo = null;
      if (promo_code) {
        const promoError =
          await this.promosService.checkPromoByCodeWithTransaction(
            promo_code,
            queryRunner.manager,
          );

        if (promoError) {
          childErrors.push(promoError);
        }

        promo = await queryRunner.manager.findOne(Promo, {
          where: { code: promo_code },
          lock: { mode: 'pessimistic_write' },
        });

        if (promo.isLimited) {
          await queryRunner.manager.update(
            Promo,
            { code: promo_code },
            { quantity: () => 'quantity - 1' },
          );
        }
      }

      if (childErrors.length) {
        throw new ApplicationError(OrderError.CAN_NOT_ORDER, childErrors);
      }

      const order = await this.ordersService.saveOrderWithTransaction(
        createOrderDto,
        user,
        car,
        promo || null,
        queryRunner.manager,
      );

      const handledOrder = await this.paymentMethodInterface.startPayment(
        order.id,
        queryRunner.manager,
      );

      if (
        handledOrder.status == OrderStatusEnum.Proccessed ||
        OrderStatusEnum.UnPaid
      ) {
        await this.mailService.sendOrderInformationMail(handledOrder, user);
      }

      await queryRunner.commitTransaction();
      return handledOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (childErrors.length) {
        throw new ApplicationError(OrderError.CAN_NOT_ORDER, childErrors);
      } else {
        throw new InternalServerErrorException(error);
      }
    } finally {
      await queryRunner.release();
    }
  }
}
