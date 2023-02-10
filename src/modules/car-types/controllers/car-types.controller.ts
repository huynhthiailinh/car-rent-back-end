import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/common/cache';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Serialize } from '@common/interceptors/serialize.interceptor';
import { CarTypesDto } from '@modules/car-types/dto/car-types.dto';
import { CarsService } from '@modules/cars/services/cars.service';
import { GetCarTypesFilterDto } from '../dto/get-car-types-filter.dto';
import { CarTypesService } from '../services/car-types.service';

@ApiTags('Car Types')
@Controller({
  version: '1',
  path: 'car-types',
})
export class CarTypesController {
  constructor(
    private carTypesService: CarTypesService,
    private carsService: CarsService,
  ) {}

  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language code ("en", "ja", etc fallback to "en")',
    required: false,
  })
  @Serialize(CarTypesDto)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get car types' })
  @Get()
  async getCarTypeList(
    @Query() filterDto: GetCarTypesFilterDto,
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
      include,
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
    return await this.carTypesService.getCarTypeList(
      filterDto,
      i18n.lang,
      cars,
    );
  }
}
