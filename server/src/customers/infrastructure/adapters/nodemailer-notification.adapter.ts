import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Notification,
  NotificationPort,
} from '../../application/ports/notification.port.js';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../application/ports/customer.repository.port.js';
import { CustomerId } from '../../domain/value-objects/customer-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../shared/domain/exceptions/application.exception.js';

@Injectable()
export class NodemailerEmailAdapter implements NotificationPort {
  // this help me to establish the connection to the smtp server to send email.
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly logger = new Logger(NodemailerEmailAdapter.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<number>('SMTP_PORT'),
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });
    this.from = this.configService.getOrThrow<string>('SMTP_FROM');
  }

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recipientId),
    );

    if (!customer) {
      throw new ApplicationException(
        `User not found by ${notification.recipientId}`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    await this.transporter.sendMail({
      from: this.from,
      to: customer.getEmail().toString(),
      subject: notification.subject,
      html: notification.message,
    });

    this.logger.log(`Email send to ${customer.getEmail().getValue()}`);
  }
}
