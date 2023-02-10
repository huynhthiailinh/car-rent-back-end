import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/common/cache';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../../common/interceptors/serialize.interceptor';
import { PaymentMethodsDto } from '../dto/payment-methods.dto';
import { PaymentMethodsService } from '../services/payment-methods.service';

@ApiTags('Payment Methods')
@Controller({
  version: '1',
  path: 'payment-methods',
})
export class PaymentMethodsController {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  @Serialize(PaymentMethodsDto)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all payment methods' })
  @Get()
  getPaymentMethods() {
    return this.paymentMethodsService.getPaymentMethods();
  }
}
