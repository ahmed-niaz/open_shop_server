import { Inject, Injectable } from '@nestjs/common';
import {
  CustomerFilters,
  CustomerRepositoryPort,
} from '../../application/ports/customer.repository.port.js';
import {
  DRIZZLE,
  DrizzleDB,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider.js';
import { Customer } from '../../domain/entities/customers.entity.js';
import { CustomerId } from '../../domain/value-objects/customer-id.vo.js';
import { Email } from '../../domain/value-objects/email.vo.js';
import { customersSchema } from '../../../shared/infrastructure/database/postgres/schema/customers.schema.js';
import { and, eq, SQL } from 'drizzle-orm';

type CustomerRow = typeof customersSchema.$inferSelect;

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  // SAVE OR CREATE THE CUSTOMERS
  async save(customer: Customer): Promise<void> {
    // 1. Transform Domain Entity -> Flat DB Row Object
    const data = DrizzleCustomerRepository.toPersistence(customer);

    // 2. Insert into PostgreSQL with Drizzle
    await this.db
      .insert(customersSchema)
      .values(data)
      .onConflictDoUpdate({
        target: customersSchema.id,
        set: {
          // these properites can be changed.
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          isActive: data.isActive,
          updatedAt: data.updatedAt,
        },
      });
  }

  // FIND THE CUSTOMERS BY ID
  async findById(id: CustomerId): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customersSchema)
      .where(eq(customersSchema.id, id.getValue()))
      .limit(1);

    const row = rows[0];

    if (!row) {
      return null;
    }

    return DrizzleCustomerRepository.toDomain(row);
  }
  // FIND THE CUSTOMERS BY EMAIL
  async findByEmail(email: Email): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customersSchema)
      .where(eq(customersSchema.email, email.getValue()))
      .limit(1);

    const row = rows[0];

    if (!row) {
      return null;
    }

    return DrizzleCustomerRepository.toDomain(row);
  }

  // FIND ALL THE CUSTOMERS WITH FILTERS
  async findAll(filters: CustomerFilters): Promise<Customer[]> {
    const conditions: SQL[] = [];

    if (filters.isActive !== undefined) {
      conditions.push(eq(customersSchema.isActive, filters.isActive));
    }

    // execute query
    const query = this.db.select().from(customersSchema);

    const customerRows =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return customerRows.map((row) => DrizzleCustomerRepository.toDomain(row));
  }

  // REMOVE THE CUSTOMERS BY ID
  async delete(id: CustomerId): Promise<void> {
    await this.db
      .delete(customersSchema)
      .where(eq(customersSchema.id, id.getValue()))
      .execute();
  }

  private static toPersistence(
    customer: Customer,
  ): typeof customersSchema.$inferSelect {
    return {
      id: customer.getId().getValue(),
      email: customer.getEmail().getValue(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      phoneNumber: customer.getPhoneNumber(),
      isActive: customer.getIsActive(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    };
  }

  //   database record to domain entity
  private static toDomain(row: CustomerRow) {
    return Customer.reconstitute({
      id: new CustomerId(row.id),
      email: Email.create(row.email),
      firstName: row.firstName,
      lastName: row.lastName,
      phoneNumber: row.phoneNumber,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
