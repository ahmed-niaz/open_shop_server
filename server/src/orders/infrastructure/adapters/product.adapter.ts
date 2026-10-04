import { Inject, Injectable } from '@nestjs/common';
import { ProductPort } from '../../application/ports/product.port.js';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryPort,
} from '../../../product/application/ports/product.repository.port.js';
import { ProductId } from '../../../product/domain/value-objects/product-id.vo.js';
@Injectable()
export class ProductAdapter implements ProductPort {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productReposiotry: ProductRepositoryPort,
  ) {}
  async exists(productId: string): Promise<boolean> {
    try {
      const product = await this.productReposiotry.findById(
        new ProductId(productId),
      );

      return product !== null;
    } catch {
      return false;
    }
  }
}
