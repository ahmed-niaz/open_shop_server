import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from '../get-product.query.js';
import { Product } from '../../../domain/entities/proudct.entity.js';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../../ports/product.repository.port.js';
import { ProudctId } from '../../../domain/value-objects/product-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<
  GetProductQuery,
  Product
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}
  async execute(query: GetProductQuery): Promise<Product> {
    // Here you would typically fetch the product from a database or another source.
    // For demonstration purposes, let's assume we have a method to get the product by ID.
    const product = await this.productRepository.findById(
      new ProudctId(query.id),
    );

    if (!product) {
      throw new ApplicationException(
        `Product with ID ${query.id} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }
    return product;
  }
}
