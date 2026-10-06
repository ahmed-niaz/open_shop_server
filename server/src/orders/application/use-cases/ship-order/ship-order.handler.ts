import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ShipOrderCommand } from './ship-order.command.js';
import { Inject } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../ports/order-repository.port.js';
import { OrderId } from '../../../domain/value-objects/order-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(ShipOrderCommand)
export class ShipOrderHandler implements ICommandHandler<
  ShipOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ShipOrderCommand): Promise<void> {
    const orderExists = await this.orderRepository.findById(
      new OrderId(command.orderId),
    );

    if (!orderExists) {
      throw new ApplicationException(
        `Order with id ${command.orderId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    const trackedOrder = this.eventPublisher.mergeObjectContext(orderExists);

    trackedOrder.ship(command.trackingNumber);

    await this.orderRepository.save(trackedOrder);
    trackedOrder.commit();
  }
}
