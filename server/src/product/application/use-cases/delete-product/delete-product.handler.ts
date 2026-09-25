import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../../ports/product.repository.port.js';
import { ProudctId } from '../../../domain/value-objects/product-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';
import { DeleteProductCommand } from './delete-product.command.js';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}
  async execute(command: DeleteProductCommand): Promise<void> {
    const productID = new ProudctId(command.productId);

    // Here you would typically fetch the product from a database or another source.
    // For demonstration purposes, let's assume we have a method to get the product by ID.
    const product = await this.productRepository.findById(productID);

    if (!product) {
      throw new ApplicationException(
        `Product with ID ${command.productId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }
    await this.productRepository.delete(productID);
  }
}
