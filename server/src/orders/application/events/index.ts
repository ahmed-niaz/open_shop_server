import { OrderConfirmedHandler } from './order-confirm.handler.js';
import { OrderPlacedHandler } from './order-placed.handler.js';

export const EventHandlers = [OrderPlacedHandler, OrderConfirmedHandler];
