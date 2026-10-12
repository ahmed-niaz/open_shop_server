import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './shared/infrastructure/database/mongodb/mongo.module.js';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module.js';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductModule } from './product/proudct.module.js';
import { CustomerModule } from './customers/customer.module.js';
import { OrderModule } from './orders/order.module.js';
import { PaymentModule } from './payment/payment.module.js';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MongoModule,
    DrizzleModule,
    ProductModule,
    CustomerModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
