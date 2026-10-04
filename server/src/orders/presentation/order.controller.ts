import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { PlaceOrderCommand } from '../application/use-cases/place-order/create-order.command.js';

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
          proudctId: item.productId,
          proudctName: item.productName,
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
}
