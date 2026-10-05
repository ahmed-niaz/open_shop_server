import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository.js';
import { ORDER_REPOSITORY } from './application/ports/order-repository.port.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { OrderController } from './presentation/order.controller.js';
import { CUSTOMER } from './application/ports/customer.port.js';
import { CustomerAdapter } from './infrastructure/adapters/customer.adapter.js';
import { PRODUCT } from './application/ports/product.port.js';
import { ProductAdapter } from './infrastructure/adapters/product.adapter.js';
import { CustomerModule } from '../customers/customer.module.js';
import { ProductModule } from '../product/proudct.module.js';
import { EventHandlers } from './application/events/index.js';
import { QueryHandlers } from './application/queires/handlers/index.js';

@Module({
  imports: [CqrsModule, CustomerModule, ProductModule],
  controllers: [OrderController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
    {
      provide: CUSTOMER,
      useClass: CustomerAdapter,
    },
    {
      provide: PRODUCT,
      useClass: ProductAdapter,
    },
  ],
})
export class OrderModule {}
