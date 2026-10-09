import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  @MinLength(1)
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

  @IsNumber()
  @Min(1)
  @IsOptional()
  discount: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(1)
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
