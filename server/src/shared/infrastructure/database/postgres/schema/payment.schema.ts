import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ordersSchema } from './order.schema.js';

export const PaymentStatusSchemaEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'succeeded',
]);

export const paymentStatusEnum = PaymentStatusSchemaEnum;

export const paymentsSchema = pgTable('payments', {
  id: uuid('id').primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => ordersSchema.id),
  gatewayTransactionId: varchar('gateway_transaction_id', { length: 255 }),
  status: PaymentStatusSchemaEnum('status').notNull().default('pending'),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const paymentsRelations = relations(paymentsSchema, ({ one }) => ({
  order: one(ordersSchema, {
    fields: [paymentsSchema.orderId],
    references: [ordersSchema.id],
  }),
}));
