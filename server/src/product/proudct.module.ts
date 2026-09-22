import { Module } from '@nestjs/common';
import { ProductController } from './presentation/proudct.controller.js';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository.js';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port.js';
import { CommandHandlers } from './application/index.js';
import { QueryHandlers } from './application/queires/handlers/index.js';

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
})
export class ProductModule {}
