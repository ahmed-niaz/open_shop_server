import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port.js';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository.js';
import { CustomerController } from './presentation/customer.controller.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { QueryHandlers } from './application/queires/handlers/index.js';
import { NOTIFICATION_SERVICE } from './application/ports/notification.port.js';
import { EventHandlers } from './application/events/index.js';
import { NodemailerEmailAdapter } from './infrastructure/adapters/nodemailer-notification.adapter.js';

@Module({
  imports: [CqrsModule],
  controllers: [CustomerController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
    {
      provide: NOTIFICATION_SERVICE,
      //useClass: ConsoleNotificationAdapter, // Use ConsoleNotificationAdapter for demonstration purposes for runtime notifications. In a real-world application, you might want to implement a more robust notification service (e.g., email, SMS, push notifications) and inject it here.
      useClass: NodemailerEmailAdapter,
    },
  ],
})
export class CustomerModule {}
