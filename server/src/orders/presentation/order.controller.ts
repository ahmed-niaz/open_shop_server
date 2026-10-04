import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderResponseDto } from './dto/order-response.dto.js';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus, // this is used from cqrs.
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  // lower lever presentaiton volatile need
  async create(@Body() dto: CreateOrderDto): Promise<void> {}
}
