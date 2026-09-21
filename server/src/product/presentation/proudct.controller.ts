import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../application/use-cases/create-product/create-product.command.js';
@Controller('products')
export class ProductController {
  // dispatch event of prouduct by cqrs.
  constructor(
    private readonly commandBus: CommandBus, // this  is used from cqrs.
  ) {}
  @Post()
  async create(@Body() dto: CreateProductDto): Promise<void> {
    await this.commandBus.execute(
      new CreateProductCommand(
        dto.name,
        dto.description,
        dto.sku,
        dto.price,
        dto.currency || 'USD',
        dto.stock,
      ),
    );
  }
}
