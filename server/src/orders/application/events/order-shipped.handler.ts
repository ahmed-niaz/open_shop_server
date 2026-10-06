import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { OrderShippedEvent } from "../../domain/events/order-shipped.event.js";
import { NOTIFICATION_SERVICE, NotificationPort } from "../../../customers/application/ports/notification.port.js";
import { Inject } from "@nestjs/common";

@EventsHandler(OrderShippedEvent)
export class OrderShippedHandler implements IEventHandler<OrderShippedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderShippedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Confirmation',
      message: `Your Clean Shop Order ${event.orderId} has been shipped.Your tracking number is ${event.trackingNumber}`,
    });
  }
}