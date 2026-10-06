export class OrderDeliverdEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
  ) {}
}
