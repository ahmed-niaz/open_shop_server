import { Module } from '@nestjs/common';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository.js';

@Module({
  providers: [
    {
      provide: 'ORDER_REPOSITORY',
      useClass: DrizzleOrderRepository,
    },
  ],
})
export class OrderModule {}
