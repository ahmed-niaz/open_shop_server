import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './create-order.command.js';
import { Inject } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../ports/order-repository.port.js';
import { OrderItem } from '../../../domain/entities/order-item.entity.js';
import { Money } from '../../../../shared/domain/value-objects/money.vo.js';
import { ShippingAddress } from '../../../domain/value-objects/shipping-address.vo.js';
import { Order } from '../../../domain/entities/order.entity.js';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<
  PlaceOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<void> {
    const items = command.items.map((item) =>
      OrderItem.create(
        item.proudctId,
        item.proudctName,
        Money.create(item.unitPrice, item.currency),
        item.qunatity,
      ),
    );

    const shippingAddress = ShippingAddress.create({
      street: command.shippingStreet,
      city: command.shippingCity,
      state: command.shippingState,
      postalCode: command.shippingPostalCode,
      country: command.shippingCountry,
    });

    const order = Order.place(command.customerId, items, shippingAddress);
    await this.orderRepository.save(order);
  }
}
