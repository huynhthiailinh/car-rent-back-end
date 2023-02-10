import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationError, ChildError } from '@common/errors/application.error';
import { EntityManager, Repository } from 'typeorm';
import { Promo } from '../entities/promo.entity';
import { PromoError, SystemError } from '@common/constants/error-message';

@Injectable()
export class PromosService {
  constructor(
    @InjectRepository(Promo) private promosRepository: Repository<Promo>,
  ) {}

  async getPromoByCode(code: string) {
    const promo = await this.promosRepository.findOne({
      where: {
        code,
      },
    });

    if (!promo) {
      throw new ApplicationError(SystemError.INVALID_PARAMETER, [
        {
          key: PromoError.PROMO_NOT_FOUND,
          field: 'code',
        },
      ]);
    }

    if (
      (!promo.startedAt || new Date() >= promo.startedAt) &&
      (!promo.endedAt || new Date() <= promo.endedAt)
    ) {
      if (promo.isLimited && promo.quantity <= 0) {
        throw new ApplicationError(SystemError.INVALID_PARAMETER, [
          {
            key: PromoError.PROMO_QUANTITY_NOT_ENOUGH,
            field: 'code',
          },
        ]);
      }
    } else {
      throw new ApplicationError(SystemError.INVALID_PARAMETER, [
        {
          key: PromoError.PROMO_EXPIRED,
          field: 'code',
        },
      ]);
    }

    return promo;
  }

  async checkPromoByCodeWithTransaction(
    code: string,
    manager: EntityManager,
  ): Promise<ChildError> {
    const promo = await manager.findOne(Promo, {
      where: {
        code,
      },
      lock: { mode: 'pessimistic_write' },
    });

    if (!promo) {
      return {
        key: PromoError.PROMO_NOT_FOUND,
        field: 'promo_code',
      };
    }

    if (
      (!promo.startedAt || new Date() >= promo.startedAt) &&
      (!promo.endedAt || new Date() <= promo.endedAt)
    ) {
      if (promo.isLimited && promo.quantity < 0) {
        return {
          key: PromoError.PROMO_QUANTITY_NOT_ENOUGH,
          field: 'promo_code',
        };
      }
    } else {
      return {
        key: PromoError.PROMO_EXPIRED,
        field: 'promo_code',
      };
    }

    return null;
  }
}
