import { OrderConfirmedHandler } from './order-confirm.handler.js';
import { OrderDeliverdHandler } from './order-deliver.handler.js';
import { OrderPlacedHandler } from './order-placed.handler.js';
import { OrderShippedHandler } from './order-shipped.handler.js';

export const EventHandlers = [
  OrderPlacedHandler,
  OrderConfirmedHandler,
  OrderShippedHandler,
  OrderDeliverdHandler,
];
