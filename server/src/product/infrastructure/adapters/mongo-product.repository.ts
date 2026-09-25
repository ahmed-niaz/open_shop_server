import { Collection, Db, Filter } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';
import {
  ProductFilters,
  ProductRepositoryPort,
} from '../../application/ports/product.repository.port.js';
import { MONGO_DB } from '../../../shared/infrastructure/database/mongodb/mongo.provider.js';
import { Product } from '../../domain/entities/proudct.entity.js';
import { ProudctId } from '../../domain/value-objects/product-id.vo.js';
import { SKU } from '../../domain/value-objects/sku.vo.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';

// lower level representation of the product in the database
interface ProductDocument {
  _id: string;
  name: string;
  description: string;
  priceAmount: number;
  priceCurrency: string;
  sku: string;
  stock: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class MongoProductRepository implements ProductRepositoryPort {
  private readonly collection: Collection<ProductDocument>;

  constructor(@Inject(MONGO_DB) private readonly db: Db) {
    this.collection = this.db.collection<ProductDocument>('products');
  }

  async save(product: Product): Promise<void> {
    // 1. Transform Domain Entity -> Flat DB Row Object
    const doc = MongoProductRepository.toPersistence(product);
    await this.collection.updateOne(
      { _id: doc._id },
      { $set: doc },
      { upsert: true },
    );
  }

  // FIND ALL THE PROUDCTS WITH FILTERS
  async findById(id: ProudctId): Promise<Product | null> {
    const doc = await this.collection.findOne({ _id: id.getValue() });
    if (!doc) {
      return null;
    }
    return MongoProductRepository.toDomain(doc);
  }

  async findBySku(sku: SKU): Promise<Product | null> {
    const doc = await this.collection.findOne({ sku: sku.getValue() });
    if (!doc) {
      return null;
    }
    return MongoProductRepository.toDomain(doc);
  }

  async findByName(name: string): Promise<Product | null> {
    const doc = await this.collection.findOne({ name });
    if (!doc) {
      return null;
    }
    return MongoProductRepository.toDomain(doc);
  }

  async findAll(filters: ProductFilters): Promise<Product[]> {
    const query: Filter<ProductDocument> = {};

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceFilter: { $gte?: number; $lte?: number } = {};
      if (filters.minPrice !== undefined) {
        priceFilter.$gte = Math.round(filters.minPrice * 100);
      }
      if (filters.maxPrice !== undefined) {
        priceFilter.$lte = Math.round(filters.maxPrice * 100);
      }
      query.priceAmount = priceFilter;
    }

    const docs = await this.collection.find(query).toArray();
    return docs.map((doc) => MongoProductRepository.toDomain(doc));
  }

  async delete(id: ProudctId): Promise<void> {
    await this.collection.deleteOne({ _id: id.getValue() });
  }

  private static toPersistence(product: Product): ProductDocument {
    return {
      _id: product.id.getValue(),
      name: product.name,
      description: product.description,
      priceAmount: product.price.toCents(),
      priceCurrency: product.price.getCurrency(),
      sku: product.sku.getValue(),
      stock: product.stock,
      isActive: product.isActive,
      lowStockThreshold: product.lowStockThreshold,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private static toDomain(doc: ProductDocument): Product {
    return Product.reconstitute({
      id: new ProudctId(doc._id),
      name: doc.name,
      description: doc.description,
      sku: SKU.create(doc.sku),
      price: Money.create(doc.priceAmount / 100, doc.priceCurrency),
      stock: doc.stock,
      isActive: doc.isActive,
      lowStockThreshold: doc.lowStockThreshold,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
