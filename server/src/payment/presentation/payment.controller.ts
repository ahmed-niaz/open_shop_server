import {
  Body,
  Controller,
  Headers,
  Inject,
  Logger,
  Post,
  RawBody,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../application/use-cases/create-payment.command.js';
import {
  PAYMENT_GATEWAY,
  PaymentGatewayPort,
} from '../ports/payment-gateway.port.js';

@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(
    private readonly commndBus: CommandBus,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.commndBus.execute(
      new CreatePaymentCommand(dto.orderId, dto.successUrl, dto.cancelUrl),
    );
  }

  // todo: test the stipe payment
  @Post('webhook')
  async handleWebhook(
    // incoming req body by default is actually a buffer.
    @RawBody() payload: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.paymentGateway.constructWebhookEvent(payload, signature);
    this.logger.log('got webhook event for stipe', event);
  }
}
