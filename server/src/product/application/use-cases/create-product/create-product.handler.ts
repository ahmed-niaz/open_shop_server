import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command.js';
import { Inject } from '@nestjs/common';
import { Product } from '../../../domain/entities/proudct.entity.js';
import { PRODUCT_REPOSITORY } from '../../ports/product.repository.port.js';
import { ProductRepositoryPort } from '../../ports/product.repository.port.js';
import { SKU } from '../../../domain/value-objects/sku.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<
  CreateProductCommand,
  void
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}
  async execute(command: CreateProductCommand): Promise<void> {
    const existingProductBySku = await this.productRepository.findBySku(
      SKU.create(command.sku),
    );

    if (existingProductBySku) {
      throw new ApplicationException(
        `Product with SKU ${command.sku} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const existingProductByName = await this.productRepository.findByName(
      command.name,
    );

    if (existingProductByName) {
      throw new ApplicationException(
        `Product with name ${command.name} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

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
