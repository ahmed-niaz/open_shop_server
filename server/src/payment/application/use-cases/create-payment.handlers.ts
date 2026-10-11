import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentCommand } from './create-payment.command.js';
import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo.js';
import { Inject } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from '../port/payment-repository.port.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../shared/domain/exceptions/application.exception.js';
import { ORDER_PRICING, OrderPricingPort } from '../port/order-pricing.port.js';
import { Payment } from '../../domain/entities/payment.entity.js';
import {
  PAYMENT_GATEWAY,
  PaymentGatewayPort,
} from '../../ports/payment-gateway.port.js';

interface CreatePaymentResponse {
  checkoutUrl: string;
  paymentId: string;
}

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandlers implements ICommandHandler<
  CreatePaymentCommand,
  CreatePaymentResponse
> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepositroy: PaymentRepository,
    @Inject(ORDER_PRICING)
    private readonly orderPricing: OrderPricingPort,
    private readonly eventPublisher: EventPublisher,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<CreatePaymentResponse> {
    const orderId = new UniqueId(command.orderId);
    // todo: Check payment repository and look payment by orderId using the corelation
    const existingPayment = await this.paymentRepositroy.findByOrderId(orderId);

    // todo: so that no duplicate payment occur
    if (existingPayment?.isSucceeded()) {
      throw new ApplicationException(
        `Order with ID ${command.orderId} is already been paid`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    // todo: generate checkoutUrl
    const pricing = await this.orderPricing.getOrderPricing(command.orderId);
    if (!pricing) {
      throw new ApplicationException(
        `Order with ID ${command.orderId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    let payment: Payment;
    if (existingPayment) {
      payment = this.eventPublisher.mergeObjectContext(existingPayment);
    } else {
      payment = this.eventPublisher.mergeObjectContext(
        Payment.initiate(orderId.getValue(), pricing.total),
      );
    }

    // todo: checkout session
    const { url } = await this.paymentGateway.createCheckoutSession(
      pricing.lines,
      {
        orderId: command.orderId,
        paymentId: payment.id.getValue(),
      },
      {
        successUrl: command.successUrl,
        cancelUrl: command.cancelUrl,
      },
    );
    payment.startCheckout();
    await this.paymentRepositroy.save(payment);

    payment.commit();

    return {
      paymentId: payment.id.getValue(),
      checkoutUrl: url,
    };
  }
}
