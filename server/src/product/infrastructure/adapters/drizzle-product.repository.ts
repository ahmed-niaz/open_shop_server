import { Inject, Injectable } from '@nestjs/common';
import {
  ProductFilters,
  ProductRepositoryPort,
} from '../../application/ports/product.repository.port.js';
import { Product } from '../../domain/entities/proudct.entity.js';
import { DRIZZLE } from '../../../shared/infrastructure/database/postgres/drizzle.provider.js';
import type { DrizzleDB } from '../../../shared/infrastructure/database/postgres/drizzle.provider.js';
import { productsSchema } from '../../../shared/infrastructure/database/postgres/schema/products.schema.js';
import { ProudctId } from '../../domain/value-objects/product-id.vo.js';
import { SKU } from '../../domain/value-objects/sku.vo.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { and, eq, gte, lte, SQL } from 'drizzle-orm';

@Injectable()
export class DrizzleProductRepository implements ProductRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

  // SAVE THE PROUDCTS
  async save(product: Product): Promise<void> {
    // 1. Transform Domain Entity -> Flat DB Row Object
    const row = DrizzleProductRepository.toPersistence(product);

    // 2. Insert into PostgreSQL with Drizzle
    await this.db
      .insert(productsSchema)
      .values(row)
      .onConflictDoUpdate({
        target: productsSchema.id,
        set: {
          // these properites can be changed.
          name: row.name,
          description: row.description,
          priceAmount: row.priceAmount,
          priceCurrency: row.priceCurrency,
          sku: row.sku,
          stock: row.stock,
          isActive: row.isActive,
          lowStockThreshold: row.lowStockThreshold,
          updatedAt: row.updatedAt,
        },
      });
  }

  // FIND THE PROUDCTS BY ID
  async findById(id: ProudctId): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(productsSchema)
      .where(eq(productsSchema.id, id.getValue()))
      .limit(1);

    const row = rows[0];

    if (!row) {
      return null;
    }

    return DrizzleProductRepository.toDomian(row);
  }

  // FIND THE PROUDCTS BY SKU
  async findBySku(sku: SKU): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(productsSchema)
      .where(eq(productsSchema.sku, sku.getValue()))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return DrizzleProductRepository.toDomian(rows[0]);
  }

  // FIND THE PROUDCTS BY NAME
  async findByName(name: string): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(productsSchema)
      .where(eq(productsSchema.name, name))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return DrizzleProductRepository.toDomian(rows[0]);
  }

    
  // FIND ALL THE PROUDCTS WITH FILTERS
  async findAll(filters: ProductFilters): Promise<Product[]> {
    const conditions: SQL[] = [];

    if (filters.isActive !== undefined) {
      conditions.push(eq(productsSchema.isActive, filters.isActive));
    }

    if (filters.minPrice !== undefined) {
      conditions.push(
        gte(productsSchema.priceAmount, Math.round(filters.minPrice * 100)),
      );
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(
        lte(productsSchema.priceAmount, Math.round(filters.maxPrice * 100)),
      );
    }

    // execute query
    const query = this.db.select().from(productsSchema);

    const productRows =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return productRows.map((row) => DrizzleProductRepository.toDomian(row));
  }


 async delete(id: ProudctId): Promise<void> {
    await this.db
      .delete(productsSchema)
      .where(eq(productsSchema.id, id.getValue()))
      .execute();
  }

  // drizzle type safety
  private static toPersistence(
    product: Product,
  ): typeof productsSchema.$inferSelect {
    return {
      id: product.id.getValue(),
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

  private static toDomian(row: typeof productsSchema.$inferSelect): Product {
    return Product.reconstitute({
      id: new ProudctId(row.id),
      name: row.name,
      description: row.description,
      sku: SKU.create(row.sku),
      price: Money.create(row.priceAmount / 100, row.priceCurrency),
      stock: row.stock,
      isActive: row.isActive,
      lowStockThreshold: row.lowStockThreshold,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

// toPersistence --> Converts Domain Entity -> Database Row before writing/inserting to Postgres.
// toDomain / reconstitute --> Converts Database Row -> Domain Entity when reading from Postgres (findById).
// $inferSelect / $inferInsert --> Drizzle's auto-generated TypeScript type matching the exact schema definition.
