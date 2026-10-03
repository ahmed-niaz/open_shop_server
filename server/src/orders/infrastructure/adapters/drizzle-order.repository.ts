import { Inject, Injectable } from '@nestjs/common';
import { OrderRepositoryPort } from '../../application/ports/order-repository.port.js';
import {
  DRIZZLE,
  DrizzleDB,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider.js';
import { Order } from '../../domain/entities/order.entity.js';
import {
  orderItemsSchema,
  ordersSchema,
} from '../../../shared/infrastructure/database/postgres/schema/index.js';
import { OrderId } from '../../domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../domain/entities/order-item.entity.js';
import { and, eq, notInArray } from 'drizzle-orm';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo.js';
import { ShippingAddress } from '../../domain/value-objects/shipping-address.vo.js';
import { OrderStatus } from '../../domain/value-objects/order-status.vo.js';

@Injectable()
export class DrizzleOrderRepository implements OrderRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(order: Order): Promise<void> {
    const orderRow = DrizzleOrderRepository.toPersistence(order);
    const itemRows = order.items.map((item) =>
      DrizzleOrderRepository.toItemsPersistence(item, order.id.getValue()),
    );

    await this.db.transaction(async (trx) => {
      await trx
        .insert(ordersSchema)
        .values(orderRow)
        .onConflictDoUpdate({
          target: ordersSchema.id,
          set: {
            status: orderRow.status,
            totalAmount: orderRow.totalAmount,
            totalCurrency: orderRow.totalCurrency,
            shippingStreet: orderRow.shippingStreet,
            shippingCity: orderRow.shippingCity,
            shippingState: orderRow.shippingState,
            shippingPostalCode: orderRow.shippingPostalCode,
            shippingCountry: orderRow.shippingCountry,
            trackingNumber: orderRow.trackingNumber,
            notes: orderRow.notes,
            updatedAt: orderRow.updatedAt,
          },
        });

      for (const itemRow of itemRows) {
        await trx
          .insert(orderItemsSchema)
          .values(itemRow)
          .onConflictDoUpdate({
            target: orderItemsSchema.id,
            set: {
              productId: itemRow.productId,
              productName: itemRow.productName,
              unitPriceAmount: itemRow.unitPriceAmount,
              unitPriceCurrency: itemRow.unitPriceCurrency,
              quantity: itemRow.quantity,
              discountAmount: itemRow.discountAmount,
              discountCurrency: itemRow.discountCurrency,
            },
          });
      }

      const currentItemIds = itemRows.map((item) => item.id);
      if (currentItemIds.length > 0) {
        await trx
          .delete(orderItemsSchema)
          .where(
            and(
              eq(orderItemsSchema.orderId, order.id.getValue()),
              notInArray(orderItemsSchema.id, currentItemIds),
            ),
          );
      } else {
        await trx
          .delete(orderItemsSchema)
          .where(eq(orderItemsSchema.orderId, order.id.getValue()));
      }
    });
  }

  async findById(id: OrderId): Promise<Order | null> {
    const orderRow = await this.db
      .select()
      .from(ordersSchema)
      .where(eq(ordersSchema.id, id.getValue()));

    if (orderRow.length === 0) return null;

    const itemRows = await this.db
      .select()
      .from(orderItemsSchema)
      .where(eq(orderItemsSchema.orderId, id.getValue()));

    return DrizzleOrderRepository.toDomain(orderRow[0], itemRows);
  }

  async findByCustomerId(customerId: string): Promise<any> {}
  async delete(id: OrderId): Promise<any> {}

  private static toPersistence(order: Order): typeof ordersSchema.$inferInsert {
    const totalAmount = order.getTotalAmount();
    return {
      id: order.id.getValue(),
      customerId: order.customerId,
      status: order.status.getValue(),
      totalAmount: totalAmount.toCents(),
      totalCurrency: totalAmount.getCurrency(),
      shippingStreet: order.shippingAddress.street,
      shippingCity: order.shippingAddress.city,
      shippingState: order.shippingAddress.state,
      shippingPostalCode: order.shippingAddress.postalCode,
      shippingCountry: order.shippingAddress.country,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private static toItemsPersistence(
    item: OrderItem,
    orderId: string,
  ): typeof orderItemsSchema.$inferInsert {
    return {
      id: item.getId().getValue(),
      orderId: orderId,
      productId: item.productId,
      productName: item.productName,
      unitPriceAmount: item.unitPrice.toCents(),
      unitPriceCurrency: item.unitPrice.getCurrency(),
      quantity: item.quantity,
      discountAmount: item.discount?.toCents() ?? null,
      discountCurrency: item.discount?.getCurrency() ?? undefined,
      createdAt: new Date(),
    };
  }

  private static toDomain(
    orderRow: typeof ordersSchema.$inferSelect,
    itemRows: (typeof orderItemsSchema.$inferSelect)[],
  ): Order {
    const items = itemRows.map((row) => {
      const discount =
        row.discountAmount !== null && row.discountCurrency !== null
          ? Money.create(row.discountAmount / 100, row.discountCurrency)
          : null;

      return OrderItem.reconstitute({
        id: new UniqueId(row.id),
        productId: row.productId,
        productName: row.productName,
        unitPrice: Money.create(
          row.unitPriceAmount / 100,
          row.unitPriceCurrency,
        ),
        quantity: row.quantity,
        discount: discount,
      });
    });

    // shipping address value object
    const shippingAddress = ShippingAddress.create({
      street: orderRow.shippingStreet ?? '',
      city: orderRow.shippingCity ?? '',
      state: orderRow.shippingState ?? '',
      postalCode: orderRow.shippingPostalCode ?? '',
      country: orderRow.shippingCountry ?? '',
    });

    return Order.reconstitute({
      id: new UniqueId(orderRow.id),
      customerId: orderRow.customerId,
      status: OrderStatus.fromString(orderRow.status),
      items,
      shippingAddress,
      trackingNumber: orderRow.trackingNumber,
      notes: orderRow.notes,
      createdAt: orderRow.createdAt,
      updatedAt: orderRow.updatedAt,
    });
  }

  // end
}

// toPersistence(): Converts Domain Entity ➔ DB Row (Used when saving/writing data).

// toDomain(): Reconstitutes DB Row ➔ Domain Entity (Used when reading/querying data via findById, findByEmail, findAll).
