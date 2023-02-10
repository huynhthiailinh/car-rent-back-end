import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Serialize } from '@common/interceptors/serialize.interceptor';
import { CitiesDto } from '../dto/cities.dto';
import { GetCitiesFilterDto } from '../dto/get-cities-filter.dto';
import { CitiesService } from '../services/cities.service';

@ApiTags('Cities')
@Controller({
  version: '1',
  path: 'cities',
})
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Serialize(CitiesDto)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get cities' })
  @Get()
  async getCities(@Query() filterDto: GetCitiesFilterDto) {
    return await this.citiesService.getCities(filterDto);
  }
}
