import { MailConfigService } from '@config/mail/config.service';
import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { Order } from '@modules/orders/entities/order.entity';
import { User } from '@modules/users/entities/user.entity';
import { join } from 'path';

@Injectable()
@Processor('mail')
export class MailProcessor {
  constructor(
    private readonly mailerService: MailerService,
    private readonly mailConfig: MailConfigService,
  ) {}

  @OnQueueActive()
  public onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    console.log(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    console.log(`Failed job ${job.id} of type ${job.name}: ${error.message}`);
  }

  @Process('order-information')
  async sendOrderInformationMail(job: Job<{ order: Order; user: User }>) {
    return this.mailerService.sendMail({
      to: job.data.user.email,
      from: this.mailConfig.user,
      subject: `Create success order #${job.data.order.id}`,
      template: join(__dirname, '..', 'templates', 'create-order-success'),
      context: {
        user: job.data.user,
        order: job.data.order,
        orderDetail: job.data.order.details ? job.data.order.details[0] : '',
      },
    });
  }
}
