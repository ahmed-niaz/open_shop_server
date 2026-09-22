import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';

export const productsSchema = pgTable('products', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  priceAmount: integer('price_amount').notNull(),
  priceCurrency: varchar('price_currency', { length: 3 })
    .notNull()
    .default('BDT'),
  sku: varchar('sku', { length: 255 }).notNull().unique(),
  stock: integer('stock').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(5),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
