export interface OrderConfirmedShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export class OrderConfirmEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly shippingAddress: OrderConfirmedShippingAddress,
  ) {}
}
