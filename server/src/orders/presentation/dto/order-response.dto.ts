import { OrderItem } from '../../domain/entities/order-item.entity.js';
import { Order } from '../../domain/entities/order.entity.js';

export class OrderItemsResponseDto {
  id: string;
  proudctId: string;
  proudctName: string;
  unitPrice: number;
  currency: string;
  qunatity: number;
  discount: number | null;
  subtotal: number;

  static fromDomain(orderItem: OrderItem): OrderItemsResponseDto {
    const dto = new OrderItemsResponseDto();

    // Standard property assignments
    dto.id = orderItem.getId().getValue();
    dto.proudctId = orderItem.productId;
    dto.proudctName = orderItem.productName;
    dto.unitPrice = orderItem.unitPrice.getAmount();
    dto.currency = orderItem.unitPrice.getCurrency();
    dto.qunatity = orderItem.quantity;
    dto.discount = orderItem.discount?.getAmount() ?? null;
    dto.subtotal = orderItem.getSubtotal().getAmount();
    return dto;
  }
}

export class OrderResponseDto {
  id: string;
  customerId: string;
  status: string;
  items: OrderItemsResponseDto[];
  totalAmount: number;
  itemCount: number;
  totalCurrency: string;
  trackingNumber: string | null;
  notes: string | null;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  createdAt: string;
  updatedAt: string;

  static fromDomain(order: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    const total = order.getTotalAmount();

    dto.id = order.id.getValue();
    dto.customerId = order.customerId;
    dto.status = order.status.getValue();
    dto.items = order.items.map(OrderItemsResponseDto.fromDomain);
    dto.itemCount = order.getItemCount();
    dto.totalAmount = total.getAmount();
    dto.totalCurrency = total.getCurrency();
    dto.trackingNumber = order.trackingNumber;
    dto.notes = order.notes;
    dto.shippingStreet = order.shippingAddress.street;
    dto.shippingCity = order.shippingAddress.city;
    dto.shippingState = order.shippingAddress.state;
    dto.shippingPostalCode = order.shippingAddress.postalCode;
    dto.shippingCountry = order.shippingAddress.country;
    dto.createdAt = order.createdAt.toISOString();
    dto.updatedAt = order.updatedAt.toISOString();

    return dto;
  }
}
