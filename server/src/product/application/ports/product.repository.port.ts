import { Product } from '../../domain/entities/proudct.entity.js';
import { ProudctId } from '../../domain/value-objects/product-id.vo.js';
import { SKU } from '../../domain/value-objects/sku.vo.js';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductFilters {
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductRepositoryPort {
  // SAVE THE PROUDCTS
  save(product: Product): Promise<void>;
  // FIND THE PROUDCTS BY ID
  findById(id: ProudctId): Promise<Product | null>;
  findBySku(sku: SKU): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  // FIND ALL THE PROUDCTS WITH FILTERS
  findAll(filters: ProductFilters): Promise<Product[]>;
  delete(id:ProudctId): Promise<void>;
}
