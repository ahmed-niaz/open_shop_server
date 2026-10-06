export class CancelOrderEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
  ) {}
}
