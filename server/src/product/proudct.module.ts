import { Module } from '@nestjs/common';
import { ProductController } from './presentation/proudct.controller.js';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository.js';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port.js';
import { CommandHandlers } from './application/index.js';
import { QueryHandlers } from './application/queires/handlers/index.js';
import { ConfigService } from '@nestjs/config';
import { MongoProductRepository } from './infrastructure/adapters/mongo-product.repository.js';

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    DrizzleProductRepository,
    MongoProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
     useFactory: (configService: ConfigService, mongoRepo: MongoProductRepository, drizzleRepo: DrizzleProductRepository) => {
        return configService.get<string>('DATABASE') === 'mongodb' ?  mongoRepo : drizzleRepo;
    },
    inject: [ConfigService, MongoProductRepository, DrizzleProductRepository],
  }
  ],
})
export class ProductModule {}
