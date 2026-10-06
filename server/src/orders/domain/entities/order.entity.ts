import { AggregateRoot } from '../../../shared/domain/aggregate-root.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { OrderConfirmEvent } from '../events/order-confirmed.event.js';
import { OrderPlacedEvent } from '../events/order-place.events.js';
import { OrderShippedEvent } from '../events/order-shipped.event.js';
import { OrderId } from '../value-objects/order-id.vo.js';
import { OrderStatus } from '../value-objects/order-status.vo.js';
import { ShippingAddress } from '../value-objects/shipping-address.vo.js';
import { OrderItem } from './order-item.entity.js';

interface OrderProps {
  id: OrderId;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends AggregateRoot {
  private readonly _id: OrderId;
  private readonly _customerId: string;
  private _status: OrderStatus;
  private _items: OrderItem[];
  private readonly _shippingAddress: ShippingAddress;
  private _trackingNumber: string | null;
  private _notes: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: OrderProps) {
    super();
    this._id = props.id;
    this._customerId = props.customerId;
    this._status = props.status;
    this._items = props.items;
    this._shippingAddress = props.shippingAddress;
    this._trackingNumber = props.trackingNumber;
    this._notes = props.notes;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static place(
    customerId: string,
    items: OrderItem[],
    shippingAddress: ShippingAddress,
  ) {
    if (items.length === 0) {
      throw new DomainException('Order must have at least one item');
    }

    const now = new Date();
    const id = new OrderId();

    const order = new Order({
      id,
      customerId,
      status: OrderStatus.pending(),
      items,
      shippingAddress,
      trackingNumber: null,
      notes: null,
      createdAt: now,
      updatedAt: now,
    });

    // exending the aggregate root from the nest js cqrs, all the enitites have the apply method which allow us to send publish events  direclty inside of our entites inside of our domain model.
    order.apply(new OrderPlacedEvent(id.getValue(), customerId));

    return order;
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }

  getItemCount(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalAmount(): Money {
    return this.getSubtotal();
  }

  getSubtotal(): Money {
    if (this._items.length === 0) {
      return Money.create(0, 'USD');
    }

    return this._items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Money.zero(this._items[0].unitPrice.getCurrency()),
    );
  }

  get id(): OrderId {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get shippingAddress(): ShippingAddress {
    return this._shippingAddress;
  }

  get trackingNumber(): string | null {
    return this._trackingNumber;
  }

  get notes(): string | null {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  confirm(): void {
    this._status = this._status.confirm();
    this._updatedAt = new Date();

    this.apply(
      new OrderConfirmEvent(this._id.getValue(), this.customerId, {
        street: this._shippingAddress.street,
        city: this._shippingAddress.city,
        state: this._shippingAddress.state,
        postalCode: this._shippingAddress.postalCode,
        country: this._shippingAddress.country,
      }),
    );
  }

  ship(trackingNumber: string): void {
    if (!trackingNumber || trackingNumber.trim().length === 0) {
      throw new DomainException(`Tracking number is requried for shipping`);
    }

    this._status = this._status.ship();

    this._trackingNumber = trackingNumber.trim();
    this._updatedAt = new Date();

    this.apply(
      new OrderShippedEvent(
        this._id.getValue(),
        this.customerId,
        this._trackingNumber,
      ),
    );
  }
}
