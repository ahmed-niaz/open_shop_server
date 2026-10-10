import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../../application/port/payment-repository.port.js';
import {
  DRIZZLE,
  DrizzleDB,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider.js';
import { Payment } from '../../domain/entities/payment.entity.js';
import { paymentsSchema } from '../../../shared/infrastructure/database/postgres/schema/payment.schema.js';
import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { PaymentStatus } from '../../domain/value-objects/payment-status.vo.js';
import { PaymentId } from '../../domain/value-objects/payment-id.vo.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzlePaymentRepository implements PaymentRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
  ) {}

  async save(payment: Payment): Promise<void> {
    const row = DrizzlePaymentRepository.toPersistance(payment);

    await this.db
      .insert(paymentsSchema)
      .values(row)
      .onConflictDoUpdate({
        target: paymentsSchema.id,
        set: {
          gatewayTransactionId: row.gatewayTransactionId,
          status: row.status,
          amount: row.amount,
          currency: row.currency,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findByOrderId(orderId: UniqueId): Promise<Payment | null> {
    const rows = await this.db.query.paymentsSchema.findFirst({
      where: eq(paymentsSchema.orderId, orderId.getValue()),
    });

    if (!rows) return null;

    return DrizzlePaymentRepository.toDomain(rows);
  }

  private static toDomain(row: typeof paymentsSchema.$inferSelect): Payment {
    return Payment.reconstitute({
      id: new PaymentId(row.id),
      orderId: row.orderId,
      amount: Money.create(row.amount / 100, row.currency),
      status: PaymentStatus.fromString(row.status),
      gatewayTransactionId: row.gatewayTransactionId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private static toPersistance(
    payment: Payment,
  ): typeof paymentsSchema.$inferSelect {
    return {
      id: payment.id.getValue(),
      orderId: payment.orderId,
      amount: payment.amount.toCents(),
      currency: payment.amount.getCurrency(),
      status: payment.status.getValue(),
      gatewayTransactionId: payment.gatewayTransactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
