import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListProductQuery } from '../list-product.query.js';
import { Product } from '../../../domain/entities/proudct.entity.js';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../../ports/product.repository.port.js';
import { Inject } from '@nestjs/common';

@QueryHandler(ListProductQuery)
export class ListProductHandler implements IQueryHandler<
  ListProductQuery,
  Product[]
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}
  async execute(query: ListProductQuery): Promise<Product[]> {
    return await this.productRepository.findAll({
      isActive: query.isActive,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    });
  }
}
