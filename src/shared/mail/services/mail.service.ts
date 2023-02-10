import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Order } from '@modules/orders/entities/order.entity';
import { User } from '@modules/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async sendOrderInformationMail(order: Order, user: User) {
    await this.mailQueue.add('order-information', {
      order,
      user,
    });
  }
}
