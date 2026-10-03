import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { customersSchema, productsSchema } from './index.js';
import { relations } from 'drizzle-orm';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
  'failed',
]);

export const ordersSchema = pgTable('orders', {
  id: uuid('id').primaryKey(),
  // foreign key to the customers table
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customersSchema.id),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: integer('total_amount').notNull(),
  totalCurrency: varchar('total_currency', { length: 3 })
    .notNull()
    .default('USD'),

  shippingStreet: varchar('shipping_street', { length: 255 }).notNull(),
  shippingCity: varchar('shipping_city', { length: 100 }).notNull(),
  shippingState: varchar('shipping_state', { length: 100 }).notNull(),
  shippingPostalCode: varchar('shipping_postal_code', { length: 20 }).notNull(),
  shippingCountry: varchar('shipping_country', { length: 2 }).notNull(),

  trackingNumber: varchar('tracking_number'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orderItemsSchema = pgTable('order_items', {
  id: uuid('id').primaryKey(),
  //   foreign key to the orders table
  orderId: uuid('order_id')
    .notNull()
    .references(() => ordersSchema.id),
  productId: uuid('product_id')
    .notNull()
    .references(() => productsSchema.id),
  productName: varchar('product_name', { length: 255 }).notNull(),
  unitPriceAmount: integer('unit_price_amount').notNull(),
  unitPriceCurrency: varchar('unit_price_currency', { length: 3 })
    .notNull()
    .default('USD'),
  quantity: integer('quantity').notNull(),
  discountAmount: integer('discount_amount'),
  discountCurrency: varchar('discount_currency', { length: 3 })
    .notNull()
    .default('USD'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// drizzle order relationships
export const ordersRelations = relations(ordersSchema, ({ many }) => ({
  items: many(orderItemsSchema),
}));

export const orderItemsRelations = relations(orderItemsSchema, ({ one }) => ({
  order: one(ordersSchema, {
    fields: [orderItemsSchema.orderId],
    references: [ordersSchema.id],
  }),
}));
