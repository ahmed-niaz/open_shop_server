import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from '../get-customer.query.js';
import { Customer } from '../../../domain/entities/customers.entity.js';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../ports/customer.repository.port.js';
import { Inject } from '@nestjs/common';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';
import { CustomerId } from '../../../domain/value-objects/customer-id.vo.js';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<
  GetCustomerQuery,
  Customer
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(
      new CustomerId(query.id),
    );
    if (!customer) {
      throw new ApplicationException(
        `Product with ID ${query.id} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }
    return customer;
  }
}
