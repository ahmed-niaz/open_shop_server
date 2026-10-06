import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeliverOrderCommand } from './deliver-order.command.js';
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

@CommandHandler(DeliverOrderCommand)
export class DeliverOrderHandler implements ICommandHandler<
  DeliverOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,

    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute(command: DeliverOrderCommand): Promise<void> {
    const orderExists = await this.orderRepository.findById(
      new OrderId(command.orderId),
    );

    if (!orderExists) {
      throw new ApplicationException(
        `Order with id ${command.orderId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    const tracked = this.eventPublisher.mergeObjectContext(orderExists);

    tracked.deliver();

    await this.orderRepository.save(tracked);
    tracked.commit();
  }
}
