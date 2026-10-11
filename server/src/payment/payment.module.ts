import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/port/payment-repository.port.js';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzlePaymentRepository } from './infrastructure/adapters/drizzle-payment.repository.js';
import { PAYMENT_GATEWAY } from './ports/payment-gateway.port.js';
import { StripePaymentAdapter } from './infrastructure/adapters/stripe-payment.adapter.js';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentAdapter,
    },
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentModule {}
