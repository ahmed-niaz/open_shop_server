import { AggregateRoot } from '@nestjs/cqrs';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { PaymentId } from '../value-objects/payment-id.vo.js';
import { PaymentStatus } from '../value-objects/payment-status.vo.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

export interface PaymentProps {
  id: PaymentId;
  orderId: string;
  amount: Money;
  status: PaymentStatus;
  gatewayTransactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment extends AggregateRoot {
  private _id: PaymentId;
  private _orderId: string;
  private _amount: Money;

  private _status: PaymentStatus;
  private _gatewayTransactionId: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PaymentProps) {
    super();
    this._id = props.id;
    this._orderId = props.orderId;
    this._amount = props.amount;
    this._status = props.status;
    this._gatewayTransactionId = props.gatewayTransactionId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static initiate(orderId: string, amount: Money): Payment {
    if (amount.getAmount() <= 0) {
      throw new DomainException(`payment amount must be greater than 0`);
    }

    const now = new Date();

    return new Payment({
      id: new PaymentId(),
      orderId,
      amount,
      status: PaymentStatus.pending(),
      gatewayTransactionId: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  //   method reconstitue
  static reconstitute(props: PaymentProps): Payment {
    return new Payment(props);
  }

  get id(): PaymentId {
    return this._id;
  }

  get orderId(): string {
    return this._orderId;
  }

  get amount(): Money {
    return this._amount;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get gatewayTransactionId(): string | null {
    return this._gatewayTransactionId;
  }

  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
}
