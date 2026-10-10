import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/port/payment-repository.port.js';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzlePaymentRepository } from './infrastructure/adapters/drizzle-payment.repository.js';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentModule {}
