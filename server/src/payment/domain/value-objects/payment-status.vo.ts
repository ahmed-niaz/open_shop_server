import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

export enum PaymentStatusLog {
  Pending = 'pending',
  Processing = 'processing',
  Succeeded = 'succeeded',
}

export class PaymentStatus {
  private readonly value: PaymentStatusLog;

  private constructor(value: PaymentStatusLog) {
    this.value = value;
  }

  static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusLog.Pending);
  }
  static processing(): PaymentStatus {
    return new PaymentStatus(PaymentStatusLog.Processing);
  }
  static succeeded(): PaymentStatus {
    return new PaymentStatus(PaymentStatusLog.Succeeded);
  }

  // usefull for the database converstion
  static fromString(value: string): PaymentStatus {
    const status = Object.values(PaymentStatusLog).find((ps) => ps === value);
    if (!status) {
      throw new DomainException(`invalid payment status ${value}`);
    }

    return new PaymentStatus(status);
  }

  getValue(): PaymentStatusLog {
    return this.value;
  }
}
