// wrapper over the nest js cqrs it allows to create abstraction
// aggregate root is the core concept of DDD. it represntaion the entry point and consiting the boundary of a group related to the domain object.
// nest js cqrs  repreente the entry point & consistencey boundary for a group of related domain ..aggregate lifecycle support, event sourcing

import { AggregateRoot as CQRSAggregateRoot } from '@nestjs/cqrs';

export abstract class AggregateRoot extends CQRSAggregateRoot {}
