import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo.js';
import { Payment } from '../../domain/entities/payment.entity.js';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findByOrderId(orderId: UniqueId): Promise<Payment | null>;
}
