import { ConfirmOrderHandler } from './confirm-order/confirm-order.handler.js';
import { PlaceOrderHandler } from './place-order/create-order.handler.js';

export const CommandHandlers = [PlaceOrderHandler, ConfirmOrderHandler];
