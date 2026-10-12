import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { PaymentCompletedEvent } from '../../../payment/domain/event/payment-completed.event.js';
import { ConfirmOrderCommand } from '../use-cases/confirm-order/confirm-order.command.js';

@Injectable()
export class OrderFulfilmentSaga {
  @Saga()
  paymentCompleted = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PaymentCompletedEvent),
      map(
        (event: PaymentCompletedEvent) =>
          new ConfirmOrderCommand(event.orderId),
      ),
    );
  };
}
