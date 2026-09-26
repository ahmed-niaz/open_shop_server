import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port.js';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository.js';
import { CustomerController } from './presentation/customer.controller.js';
import { CommandHandlers } from './application/use-cases/index.js';

@Module({
  imports: [CqrsModule],
  controllers: [CustomerController],
  providers: [
    ...CommandHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
})
export class CustomerModule {}
