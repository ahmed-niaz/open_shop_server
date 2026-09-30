import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCustomerCommand } from './register-customer.command.js';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../ports/customer.repository.port.js';
import { Customer } from '../../../domain/entities/customers.entity.js';
import { Email } from '../../../domain/value-objects/email.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(RegisterCustomerCommand)
export class RegisterCustomerHandler implements ICommandHandler<
  RegisterCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RegisterCustomerCommand): Promise<void> {
    const email = Email.create(command.email);
    const existingCustomer = await this.customerRepository.findByEmail(email);

    if (existingCustomer) {
      throw new ApplicationException(
        `Customer with email ${command.email} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }
    // Create a new Customer entity from the command data
    const customer = this.eventPublisher.mergeObjectContext(
      Customer.register(
        email,
        command.firstName,
        command.lastName,
        command.phoneNumber,
      ),
    );

    await this.customerRepository.save(customer);

    customer.commit(); // Commit the events to be published
  }
}
