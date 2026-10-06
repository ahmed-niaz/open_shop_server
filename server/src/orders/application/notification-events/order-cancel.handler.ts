import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../../../customers/application/ports/notification.port.js';
import { Inject } from '@nestjs/common';
import { CancelOrderEvent } from '../../domain/events/order-cancel.event.js';

@EventsHandler(CancelOrderEvent)
export class OrderCanceledHandler implements IEventHandler<CancelOrderEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: CancelOrderEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Canceled',
      message: `Your Clean Shop Order ${event.orderId} has been Canceled.`,
    });
  }
}
