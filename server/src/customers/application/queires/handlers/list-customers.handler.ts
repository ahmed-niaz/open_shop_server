import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomerQuery } from '../list-customer.query.js';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../ports/customer.repository.port.js';

@QueryHandler(ListCustomerQuery)
export class ListCustomerHandler implements IQueryHandler<ListCustomerQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(query: ListCustomerQuery): Promise<any> {
    return await this.customerRepository.findAll({
      isActive: query.isActive,
    });
  }
}
