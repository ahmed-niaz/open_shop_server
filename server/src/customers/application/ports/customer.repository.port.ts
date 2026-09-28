import { Customer } from '../../domain/entities/customers.entity.js';
import { CustomerId } from '../../domain/value-objects/customer-id.vo.js';
import { Email } from '../../domain/value-objects/email.vo.js';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CustomerFilters {
  isActive?: boolean;
}

export interface CustomerRepositoryPort {
  // SAVE OR CREATE THE CUSTOMERS
  save(customer: Customer): Promise<void>;
  // FIND THE CUSTOMERS BY ID
  findById(id: CustomerId): Promise<Customer | null>;
  findByEmail(email: Email): Promise<Customer | null>;
  // FIND ALL THE CUSTOMERS WITH FILTERS
  findAll(filters: CustomerFilters): Promise<Customer[]>;

  // REMOVE THE CUSTOMERS BY ID
  delete(id: CustomerId): Promise<void>;
}
