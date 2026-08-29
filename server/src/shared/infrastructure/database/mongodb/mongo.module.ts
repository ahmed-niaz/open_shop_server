import { MongoProvider } from './mongo.provider.js';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [MongoProvider],
  exports: [MongoProvider],
})
export class MongoModule {}
