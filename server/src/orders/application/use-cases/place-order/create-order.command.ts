// redeclare to the properiest pass to  the handler again becuase we can sepatre the presentation from the application layer. We do not want to be relying on lower lever dependencies. In this case, the presentaion level dto becuse those those are gonna change and depend on the choosen presentation layer [its a lower level volatile dependency and we are gonna rely on it.]. By istalling dependecies like this and we declaing it. we are able to swap this out in the runtime that we for the repository liek graphql, no change to the application layer.

export interface CreateOrderItemDto {
  productId: string;
  productName: string;
  unitPrice: number;
  currency: string;
  qunatity: number;
  discount?: number;
}

export class PlaceOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: CreateOrderItemDto[],
    public readonly shippingStreet: string,
    public readonly shippingCity: string,
    public readonly shippingState: string,
    public readonly shippingPostalCode: string,
    public readonly shippingCountry: string,
  ) {}
}
