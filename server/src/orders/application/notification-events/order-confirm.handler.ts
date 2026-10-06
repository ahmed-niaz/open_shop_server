import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderConfirmEvent } from '../../domain/events/order-confirmed.event.js';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../../../customers/application/ports/notification.port.js';
import { ConfigService } from '@nestjs/config';

@EventsHandler(OrderConfirmEvent)
export class OrderConfirmedHandler implements IEventHandler<OrderConfirmEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
    private readonly configService: ConfigService,
  ) {}
  async handle(event: OrderConfirmEvent) {
    const { street, city, state, postalCode, country } = event.shippingAddress;

    await this.notificationService.sendNotification({
      recipientId: this.configService.getOrThrow('ADMIN_USER_ID'),
      subject: 'Order Ready to Ship',
      message: `
            Your order has been successfully paid and is now ready for shipment.

            Order ID: ${event.orderId}

            Shipping Address:
            ${street}
            ${city}, ${state} - ${postalCode}
            ${country}

            Thank you for your order. We'll notify you once your order has been shipped.
            `,
    });
  }
}
