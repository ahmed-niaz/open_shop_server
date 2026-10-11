import { Body, Controller, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../application/use-cases/create-payment.command.js';

@Controller('payments')
export class PaymentController {
  constructor(private readonly commndBus: CommandBus) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.commndBus.execute(
      new CreatePaymentCommand(dto.orderId, dto.successUrl, dto.cancelUrl),
    );
  }
}
