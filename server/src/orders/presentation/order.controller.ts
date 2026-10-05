import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { PlaceOrderCommand } from '../application/use-cases/place-order/create-order.command.js';
import { OrderResponseDto } from './dto/order-response.dto.js';
import { ListOrdersQuery } from '../application/queires/list-orders.query.js';
import { Order } from '../domain/entities/order.entity.js';
import { GetOrderQuery } from '../application/queires/get-order.query.js';
import { ConfirmOrderCommand } from '../application/use-cases/confirm-order/confirm-order.command.js';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus, // this is used from cqrs.
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  // lower lever presentaiton volatile need [here we do not return any data]
  async create(@Body() dto: CreateOrderDto): Promise<void> {
    await this.commandBus.execute<PlaceOrderCommand, void>(
      new PlaceOrderCommand(
        dto.customerId,
        dto.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          currency: item.currency ?? 'USD',
          qunatity: item.quantity,
        })),
        dto.shippingStreet,
        dto.shippingCity,
        dto.shippingPostalCode,
        dto.shippingState,
        dto.shippingCountry,
      ),
    );
  }

  // get orders
  @Get(['', 'all'])
  async findAll(
    @Query('customerId') customerId?: string,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.queryBus.execute<ListOrdersQuery, Order[]>(
      new ListOrdersQuery(customerId),
    );

    return orders.map(OrderResponseDto.fromDomain);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<OrderResponseDto> {
    const order = await this.queryBus.execute<GetOrderQuery, Order>(
      new GetOrderQuery(id),
    );

    return OrderResponseDto.fromDomain(order);
  }

  @Patch(':id/confirm')
  async confirm(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute<ConfirmOrderCommand>(
      new ConfirmOrderCommand(id),
    );
  }
}
