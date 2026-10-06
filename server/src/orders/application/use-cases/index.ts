import { ConfirmOrderHandler } from './confirm-order/confirm-order.handler.js';
import { DeliverOrderHandler } from './deliver-order/deliver-order.handler.js';
import { PlaceOrderHandler } from './place-order/create-order.handler.js';
import { ShipOrderHandler } from './ship-order/ship-order.handler.js';

export const CommandHandlers = [
  PlaceOrderHandler,
  ConfirmOrderHandler,
  ShipOrderHandler,
  DeliverOrderHandler,
];
