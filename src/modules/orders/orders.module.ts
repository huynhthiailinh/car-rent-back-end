import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../cars/entities/car.entity';
import { MailService } from '@shared/mail/services/mail.service';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { Promo } from '../promos/entities/promo.entity';
import { Review } from '../reviews/entities/review.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { PromosService } from '../promos/services/promos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Car, Promo, Review]),
    PaymentMethodsModule,
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PromosService, MailService],
})
export class OrdersModule {}
