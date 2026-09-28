import { DeleteCustomerHandler } from './delete-customer/delete-customer.handlers.js';
import { RegisterCustomerHandler } from './register-customer/register-customer.handler.js';

export const CommandHandlers = [RegisterCustomerHandler, DeleteCustomerHandler];
