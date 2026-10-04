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
import { CUSTOMER, CustomerPort } from '../../ports/customer.port.js';
import { PRODUCT, ProductPort } from '../../ports/product.port.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<
  PlaceOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(CUSTOMER)
    private readonly customer: CustomerPort,
    @Inject(PRODUCT)
    private readonly product: ProductPort,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<void> {
    const customerExist = await this.customer.exists(command.customerId);
    if (!customerExist) {
      throw new ApplicationException(
        `Customer with id ${command.customerId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    for (const item of command.items) {
      const productExists = await this.product.exists(item.productId);
      if (!productExists) {
        throw new ApplicationException(
          `Product with id ${item.productId} not found`,
          ApplicationExceptionCode.NOT_FOUND,
        );
      }
    }

    const items = command.items.map((item) =>
      OrderItem.create(
        item.productId,
        item.productName,
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
