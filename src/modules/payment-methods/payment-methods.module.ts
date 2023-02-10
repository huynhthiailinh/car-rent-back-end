import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodCodeEnum } from './constants/payment-method-code.enum';
import { PaymentMethodsController } from './controllers/payment-methods.controller';
import { PaymentMethod } from './entities/payment-method.entity';
import { CodMethodService } from './services/cod-method.service';
import { StripeMethodService } from './services/stripe-method.service';
import { PaymentMethodsService } from './services/payment-methods.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  controllers: [PaymentMethodsController],
  providers: [
    PaymentMethodsService,
    CodMethodService,
    StripeMethodService,
    {
      provide: 'PaymentInterface',
      scope: Scope.REQUEST,
      inject: [REQUEST, CodMethodService, StripeMethodService],
      useFactory: (
        request: Request,
        codMethodService: CodMethodService,
        stripeMethodService: StripeMethodService,
      ) => {
        const paymentMethodCode = request.body['payment_method_code'];
        switch (paymentMethodCode) {
          case PaymentMethodCodeEnum.Cod:
            return codMethodService;
          case PaymentMethodCodeEnum.Stripe:
            return stripeMethodService;
        }
      },
    },
  ],
  exports: ['PaymentInterface'],
})
export class PaymentMethodsModule {}
