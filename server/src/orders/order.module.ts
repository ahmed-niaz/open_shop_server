import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository.js';
import { ORDER_REPOSITORY } from './application/ports/order-repository.port.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { OrderController } from './presentation/order.controller.js';

@Module({
  imports: [CqrsModule],
  controllers: [OrderController],
  providers: [
    ...CommandHandlers,
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
  ],
})
export class OrderModule {}
