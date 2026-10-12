import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/port/payment-repository.port.js';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzlePaymentRepository } from './infrastructure/adapters/drizzle-payment.repository.js';
import { PAYMENT_GATEWAY } from './ports/payment-gateway.port.js';
import { StripePaymentAdapter } from './infrastructure/adapters/stripe-payment.adapter.js';
import { ORDER_PRICING } from './application/port/order-pricing.port.js';
import { OrderPricingAdapter } from './infrastructure/adapters/order-pricing.adapter.js';
import { OrderModule } from '../orders/order.module.js';
import { PaymentController } from './presentation/payment.controller.js';
import { CommandHandlers } from './application/use-cases/index.js';

@Module({
  imports: [CqrsModule, OrderModule],
  controllers: [PaymentController],
  providers: [
    ...CommandHandlers,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentAdapter,
    },
    {
      provide: ORDER_PRICING,
      useClass: OrderPricingAdapter,
    },
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentModule {}
