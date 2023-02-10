import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../../common/interceptors/serialize.interceptor';
import { PromoDto } from '../dto/promo.dto';
import { PromosService } from '../services/promos.service';

@ApiTags('Promos')
@Controller({
  version: '1',
  path: 'promos',
})
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Serialize(PromoDto)
  @ApiOperation({ summary: 'Get promo by code' })
  @ApiQuery({ name: 'code', example: 'EKPT0940KN5' })
  @Get()
  async getPromoByCode(@Query('code') code: string) {
    return await this.promosService.getPromoByCode(code);
  }
}
