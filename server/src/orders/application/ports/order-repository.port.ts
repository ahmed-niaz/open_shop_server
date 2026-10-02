import { Order } from '../../domain/entities/order.entity.js';
import { OrderId } from '../../domain/value-objects/order-id.vo.js';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  delete(id: OrderId): Promise<void>;
}
