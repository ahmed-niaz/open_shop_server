import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerRegisterEvent } from '../../domain/events/customer-register.event.js';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../ports/notification.port.js';
import { Inject } from '@nestjs/common';

@EventsHandler(CustomerRegisterEvent)
export class CustomerRegisterHandler implements IEventHandler<CustomerRegisterEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort, // Replace 'any' with the actual type of your notification service
  ) {}
  async handle(event: CustomerRegisterEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Welcome to Our Service!',
      message: `Hello ${event.firstName}, thank you for registering with us!`,
    });
  }
}
