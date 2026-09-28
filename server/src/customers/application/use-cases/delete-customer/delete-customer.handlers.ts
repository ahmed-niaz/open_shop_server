import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from './delete-customer.command.js';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../ports/customer.repository.port.js';
import { Inject } from '@nestjs/common';
import { CustomerId } from '../../../domain/value-objects/customer-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customer = new CustomerId(command.customerId);

    if (!customer) {
      throw new ApplicationException(
        `Customer with ID ${command.customerId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    await this.customerRepository.delete(customer);
  }
}
