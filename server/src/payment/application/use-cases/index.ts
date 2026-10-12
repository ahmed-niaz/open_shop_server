import { ConfirmPaymentHandler } from './confirm-payment/confirm-payment.handlers.js';
import { CreatePaymentHandlers } from './create-payment/create-payment.handlers.js';

export const CommandHandlers = [CreatePaymentHandlers, ConfirmPaymentHandler];
