import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Notification,
  NotificationPort,
} from '../../application/ports/notification.port.js';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../application/ports/customer.repository.port.js';
import { CustomerId } from '../../domain/value-objects/customer-id.vo.js';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  // explecilty inject the customer repository port to send notifications when a customer is registered
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly CustomerRepository: CustomerRepositoryPort,
  ) {}

  async sendNotification(notification: Notification): Promise<void> {
    // 1.check the customer frist
    const customer = await this.CustomerRepository.findById(
      new CustomerId(notification.recipientId),
    );

    // 2.
    const recipient =
      customer?.getEmail().getValue() ?? notification.recipientId;

    this.logger.log(
      `[${notification.subject ? `Subject: ${notification.subject}` : ''} Recipient: ${recipient} Message: ${notification.message}]`,
    );
  }
}

// The console notification is a low-level implementation detail, while the customer repository represents a higher-level abstraction.

// Low-level details should depend on higher-level abstractions, not the other way around.
