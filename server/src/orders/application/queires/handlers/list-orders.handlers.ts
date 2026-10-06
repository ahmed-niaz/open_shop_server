import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListOrdersQuery } from '../list-orders.query.js';
import { Order } from '../../../domain/entities/order.entity.js';
import { Inject } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../ports/order-repository.port.js';

@QueryHandler(ListOrdersQuery)
export class ListOrderHandler implements IQueryHandler<
  ListOrdersQuery,
  Order[]
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: ListOrdersQuery): Promise<Order[]> {
    if (query.customerId !== undefined) {
      const trimmed = query.customerId.trim();
      if (!trimmed) {
        return [];
      }
      return this.orderRepository.findByCustomerId(trimmed);
    }

    return this.orderRepository.findAll();
  }
}
