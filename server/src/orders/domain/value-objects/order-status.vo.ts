import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

export type OrderStatusValue =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'
  | 'failed';

export class OrderStatus {
  private static readonly VALID_TRANSACTIONS: Record<
    OrderStatusValue,
    OrderStatusValue[]
  > = {
    pending: ['confirmed', 'cancelled', 'failed'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered', 'returned'], // returned = failed delivery / refused
    delivered: ['returned'],
    cancelled: ['refunded'], // only if already paid
    returned: ['refunded'],
    refunded: [],
    failed: [],
  };

  private constructor(private readonly value: OrderStatusValue) {}

  static pending(): OrderStatus {
    return new OrderStatus('pending');
  }

  static confirmed(): OrderStatus {
    return new OrderStatus('confirmed');
  }

  static shipped(): OrderStatus {
    return new OrderStatus('shipped');
  }
  static delivered(): OrderStatus {
    return new OrderStatus('delivered');
  }
  static cancelled(): OrderStatus {
    return new OrderStatus('cancelled');
  }

  static returned(): OrderStatus {
    return new OrderStatus('returned');
  }
  static refunded(): OrderStatus {
    return new OrderStatus('refunded');
  }
  static failed(): OrderStatus {
    return new OrderStatus('failed');
  }

  static fromString(value: string): OrderStatus {
    const valid: OrderStatusValue[] = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
      'returned',
      'refunded',
      'failed',
    ];

    if (!valid.includes(value as OrderStatusValue)) {
      throw new DomainException(`Invalid order status: ${value}`);
    }

    return new OrderStatus(value as OrderStatusValue);
  }

  // helper method to get the string value of the OrderStatus

  canPending(): boolean {
    return this.canTransitionTo('pending');
  }

  canConfirm(): boolean {
    return this.canTransitionTo('confirmed');
  }
  canShip(): boolean {
    return this.canTransitionTo('shipped');
  }
  canDeliver(): boolean {
    return this.canTransitionTo('delivered');
  }
  canCancel(): boolean {
    return this.canTransitionTo('cancelled');
  }
  canReturn(): boolean {
    return this.canTransitionTo('returned');
  }
  canRefund(): boolean {
    return this.canTransitionTo('refunded');
  }
  canFail(): boolean {
    return this.canTransitionTo('failed');
  }

  //
  pending(): OrderStatus {
    return this.transitionTo('pending');
  }
  confirm(): OrderStatus {
    return this.transitionTo('confirmed');
  }

  ship(): OrderStatus {
    return this.transitionTo('shipped');
  }
  deliver(): OrderStatus {
    return this.transitionTo('delivered');
  }
  cancel(): OrderStatus {
    return this.transitionTo('cancelled');
  }
  return(): OrderStatus {
    return this.transitionTo('returned');
  }
  refund(): OrderStatus {
    return this.transitionTo('refunded');
  }
  fail(): OrderStatus {
    return this.transitionTo('failed');
  }

  getValue(): OrderStatusValue {
    return this.value;
  }

  equals(other: OrderStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  private canTransitionTo(newStatus: OrderStatusValue): boolean {
    const validTransitions = OrderStatus.VALID_TRANSACTIONS[this.value];
    return validTransitions.includes(newStatus);
  }

  private transitionTo(newStatus: OrderStatusValue): OrderStatus {
    if (!this.canTransitionTo(newStatus)) {
      throw new DomainException(
        `Invalid transition from ${this.value} to ${newStatus}`,
      );
    }

    return new OrderStatus(newStatus);
  }
}

// todo: Two things
// 1. Cupling our data model to the database is not a good idea. We should create a separate data model for the database and map it to our domain model.

// 2/.
