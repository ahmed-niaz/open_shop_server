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
import { ShipOrderDto } from './dto/ship-order.dto.js';
import { ShipOrderCommand } from '../application/use-cases/ship-order/ship-order.command.js';
import { DeliverOrderCommand } from '../application/use-cases/deliver-order/deliver-order.command.js';
import { CancelOrderCommand } from '../application/use-cases/cancel-order/cancel-order.command.js';

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
          discount: item.discount,
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

  @Patch(':id/ship')
  async ship(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ShipOrderDto,
  ): Promise<void> {
    await this.commandBus.execute<ShipOrderCommand>(
      new ShipOrderCommand(id, dto.trackingNumber),
    );
  }

  @Patch(':id/deliver')
  async deliver(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute<DeliverOrderCommand>(
      new DeliverOrderCommand(id),
    );
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('reason') reason: string,
  ): Promise<void> {
    await this.commandBus.execute<CancelOrderCommand>(
      new CancelOrderCommand(id, reason),
    );
  }
}
