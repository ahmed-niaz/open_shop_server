import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../../../customers/application/ports/notification.port.js';
import { Inject } from '@nestjs/common';
import { OrderDeliverdEvent } from '../../domain/events/order-deliver.event.js';

@EventsHandler(OrderDeliverdEvent)
export class OrderDeliverdHandler implements IEventHandler<OrderDeliverdEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderDeliverdEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Deliverd',
      message: `Your Clean Shop Order ${event.orderId} has been deliverd to your requred place.`,
    });
  }
}
