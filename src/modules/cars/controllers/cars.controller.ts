import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/common/cache';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Serialize } from '@common/interceptors/serialize.interceptor';
import { CurrentUser } from '@common/decorators/requests/current-user.decorator';
import { Public } from '@common/decorators/requests/public.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { User } from '@modules/users/entities/user.entity';
import { CarsService } from '../services/cars.service';
import { CapacityListDto } from '../dto/capacity-list.dto';
import { CarDetailDto } from '../dto/car-detail.dto';
import { CarsDto } from '../dto/cars.dto';
import { GetCapacityListFilterDto } from '../dto/get-capacity-list-filter.dto';
import { GetCarByIdQueryDto } from '../dto/get-car-by-id-query.dto';
import { GetCarsFilterDto } from '../dto/get-cars-filter.dto';
import { GetRentedDatesQueryDto } from '../dto/get-rented-dates-query.dto';
import { RentedDatesDto } from '../dto/rented-dates.dto';

@ApiTags('Cars')
@Controller({
  version: '1',
  path: 'cars',
})
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language code ("en", "ja", etc fallback to "en")',
    required: false,
  })
  @ApiOperation({ summary: 'Get cars' })
  @UseGuards(JwtAuthGuard)
  @Public()
  @Serialize(CarsDto)
  @Get()
  async getCars(
    @Query() filterDto: GetCarsFilterDto,
    @I18n() i18n: I18nContext,
    @CurrentUser() user: User,
  ) {
    return await this.carsService.getCars(filterDto, i18n.lang, user);
  }

  @Serialize(CapacityListDto)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get capacity list' })
  @Get('/capacity-list')
  async getCapacityList(
    @Query() filterDto: GetCapacityListFilterDto,
    @I18n() i18n: I18nContext,
  ) {
    const {
      pick_up_city_id,
      pick_up_at,
      drop_off_city_id,
      drop_off_at,
      search,
      type,
      capacity,
      max_price,
    } = filterDto;

    let cars = [];
    let total = 0;

    if (
      pick_up_city_id ||
      pick_up_at ||
      drop_off_city_id ||
      drop_off_at ||
      search ||
      type ||
      capacity ||
      max_price
    ) {
      [cars, total] = await this.carsService.getCarsWithFilter(
        {
          limit: 100,
          offset: 0,
          pick_up_city_id,
          pick_up_at,
          drop_off_city_id,
          drop_off_at,
          order_by: null,
          search,
          type,
          capacity,
          max_price,
        },
        i18n.lang,
        null,
      );
    }
    return await this.carsService.getCapacityList(filterDto, cars);
  }

  @ApiBearerAuth('accessToken')
  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language code ("en", "ja", etc fallback to "en")',
    required: false,
  })
  @ApiOperation({ summary: 'Get car by id' })
  @UseGuards(JwtAuthGuard)
  @Public()
  @Serialize(CarDetailDto)
  @Get('/:id')
  async getCarById(
    @Param('id') id: number,
    @Query() queryDto: GetCarByIdQueryDto,
    @I18n() i18n: I18nContext,
    @CurrentUser() user: User,
  ) {
    return await this.carsService.getCarById(id, queryDto, i18n.lang, user);
  }

  @ApiOperation({ summary: 'Get rented dates by car id' })
  @Serialize(RentedDatesDto)
  @Get('/:id/rented-dates')
  async getRentedDatesByCarId(
    @Param('id') id: number,
    @Query() queryDto: GetRentedDatesQueryDto,
  ) {
    return await this.carsService.getRentedDatesByCarId(id, queryDto);
  }
}
