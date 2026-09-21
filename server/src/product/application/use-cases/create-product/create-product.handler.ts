import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command.js';
import { Inject } from '@nestjs/common';
import { Product } from '../../../domain/entities/proudct.entity.js';
import { PRODUCT_REPOSITORY } from '../../ports/product.repository.port.js';
import { ProductRepositoryPort } from '../../ports/product.repository.port.js';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}
  async execute(command: CreateProductCommand): Promise<void> {
    const product = Product.create(
      command.name,
      command.description,
      command.sku,
      command.price,
      command.currency,
      command.stock,
    );

    await this.productRepository.save(product);
  }
}
