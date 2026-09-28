import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterCustomerDto } from './dto/register-proudct.dto.js';
import { RegisterCustomerCommand } from '../application/use-cases/register-customer/register-customer.command.js';
import { Customer } from '../domain/entities/customers.entity.js';
import { ListCustomerQuery } from '../application/queires/list-customer.query.js';
import { CustomerResponseDto } from './dto/customer-response.dto.js';
import { GetCustomerQuery } from '../application/queires/get-customer.query.js';
import { DeleteCustomerCommand } from '../application/use-cases/delete-customer/delete-customer.command.js';

@Controller('customers')
export class CustomerController {
  // dispatch event of prouduct by cqrs.
  constructor(
    private readonly commandBus: CommandBus, // this  is used from cqrs.
    private readonly queryBus: QueryBus,
  ) {}

  // todo: we can add validation pipe to validate the incoming request data, and we can add exception filter to handle the exceptions thrown by the command handler.
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

  @Get('all')
  async findAll(
    @Query('isActive') isActive?: boolean,
  ): Promise<CustomerResponseDto[]> {
    const customers = await this.queryBus.execute<
      ListCustomerQuery,
      Customer[]
    >(new ListCustomerQuery(isActive));
    return customers.map(CustomerResponseDto.fromDomain);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.queryBus.execute<GetCustomerQuery, Customer>(
      new GetCustomerQuery(id),
    );
    return CustomerResponseDto.fromDomain(customer);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute<DeleteCustomerCommand, void>(
      new DeleteCustomerCommand(id),
    );
  }
}

// todo: this presentation layer is know nothing about the implementation of the repository, it only know about the port interface. It's fully decoupled from the infrastructure layer. The implementation of the repository is provided by the dependency injection container at runtime, based on the configuration of the application.
