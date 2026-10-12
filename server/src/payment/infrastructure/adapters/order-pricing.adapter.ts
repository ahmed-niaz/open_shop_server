import { Inject, Injectable } from '@nestjs/common';
import {
  OrderPricing,
  OrderPricingPort,
  PricingLine,
} from '../../application/port/order-pricing.port.js';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../../orders/application/ports/order-repository.port.js';
import { OrderId } from '../../../orders/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../orders/domain/entities/order-item.entity.js';

@Injectable()
export class OrderPricingAdapter implements OrderPricingPort {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async getOrderPricing(orderId: string): Promise<OrderPricing | null> {
    const order = await this.orderRepository.findById(new OrderId(orderId));
    if (!order) return null;

    return {
      total: order.getTotalAmount(),
      lines: order.items.map((line) => this.toPricingLine(line)),
    };
  }

  private toPricingLine(item: OrderItem): PricingLine {
    return {
      name: item.productName,
      quantity: item.quantity,
      unitAmount: item.getEffectiveUnitPrice(),
    };
  }
}
