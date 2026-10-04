import {
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  productName: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currency?: string = 'USD';

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsString()
  shippingStreet: string;

  @IsString()
  shippingCity: string;

  @IsString()
  shippingState: string;

  @IsString()
  shippingPostalCode: string;

  @IsString()
  shippingCountry: string;
}
