import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterCustomerDto } from './dto/register-proudct.dto.js';
import { RegisterCustomerCommand } from '../application/use-cases/register-customer/register-customer.command.js';

@Controller('customers')
export class CustomerController {
  // dispatch event of prouduct by cqrs.
  constructor(
    private readonly commandBus: CommandBus, // this  is used from cqrs.
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async register(@Body() dto: RegisterCustomerDto): Promise<void> {
    await this.commandBus.execute<RegisterCustomerCommand, void>(
      new RegisterCustomerCommand(
        dto.email,
        dto.firstName,
        dto.lastName,
        dto.phoneNumber,
      ),
    );
  }
}

// todo: this presentation layer is know nothing about the implementation of the repository, it only know about the port interface. It's fully decoupled from the infrastructure layer. The implementation of the repository is provided by the dependency injection container at runtime, based on the configuration of the application.
