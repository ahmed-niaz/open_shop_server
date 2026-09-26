import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../application/use-cases/create-product/create-product.command.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { ListProductQuery } from '../application/queires/list-product.query.js';
import { Product } from '../domain/entities/proudct.entity.js';
import { GetProductQuery } from '../application/queires/get-product.query.js';
import { DeleteProductCommand } from '../application/use-cases/delete-product/delete-product.command.js';

@Controller('products')
export class ProductController {
  // dispatch event of prouduct by cqrs.
  constructor(
    private readonly commandBus: CommandBus, // this  is used from cqrs.
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<void> {
    await this.commandBus.execute<CreateProductCommand, void>(
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

  @Get('all')
  async findAll(
    @Query('isActive') isActive?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Promise<ProductResponseDto[]> {
    //  the handler have not any idea about ProductResponseDto
    // we do not leaking the dto response in the domain layer OR APPLIATION layer.
    const products = await this.queryBus.execute<ListProductQuery, Product[]>(
      new ListProductQuery(
        isActive !== undefined ? isActive === 'true' : undefined,
        minPrice !== undefined ? parseFloat(minPrice) : undefined,
        maxPrice !== undefined ? parseFloat(maxPrice) : undefined,
      ),
    );

    return products.map(ProductResponseDto.fromDomain);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ProductResponseDto> {
    const product = await this.queryBus.execute<GetProductQuery, Product>(
      new GetProductQuery(id),
    );
    return ProductResponseDto.fromDomain(product);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    // Implement the delete logic here
    await this.commandBus.execute<DeleteProductCommand, void>(
      new DeleteProductCommand(id),
    );
  }
}
